import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Transaction } from '../../types';
import { TransactionForm } from './TransactionForm';
import { formatPercentage } from '../../utils/formatters';
import { useDateFormatter } from '../../utils/useDateFormatter';
import { useCurrencyFormatter } from '../../utils/useCurrencyFormatter';
import { sortTransactionsByDate, calculateTransactionAmount } from '../../utils/calculations';
import { useTranslation } from '../../i18n';
import styles from './Transactions.module.css';

export const TransactionsPanel: React.FC = () => {
  const { state, addTransaction, updateTransaction, deleteTransaction } = useAppContext();
  const { t, translateCategory } = useTranslation();
  const { formatCurrency } = useCurrencyFormatter();
  const { formatDate } = useDateFormatter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const sortedTransactions = sortTransactionsByDate(state.transactions);

  const handleAddClick = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm(t('transactions.deleteConfirm'))) {
      deleteTransaction(id);
    }
  };

  const handleSubmit = (transaction: Transaction) => {
    if (editingTransaction) {
      updateTransaction(transaction.id, transaction);
    } else {
      addTransaction(transaction);
    }
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  const getTransactionAmountDisplay = (transaction: Transaction): string => {
    if (transaction.amountType === 'fixed') {
      return formatCurrency(transaction.amount);
    } else {
      const calculatedAmount = calculateTransactionAmount(transaction, state.priceConfig);
      return `${formatPercentage(transaction.amount)} (${formatCurrency(calculatedAmount)})`;
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.addButton} onClick={handleAddClick}>
        + {t('transactions.addTransaction')}
      </button>

      {sortedTransactions.length === 0 ? (
        <div className={styles.emptyState}>
          {t('transactions.emptyState')}
        </div>
      ) : (
        <div className={styles.transactionsList}>
          {sortedTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem}>
              <span
                className={`${styles.transactionType} ${
                  transaction.type === 'income' ? styles.income : styles.payment
                }`}
                title={transaction.type === 'income' ? t('transactions.income') : t('transactions.payment')}
              >
                {transaction.type === 'income' ? '↑' : '↓'}
              </span>

              <span className={styles.transactionDate}>{formatDate(transaction.date)}</span>

              <span className={styles.transactionDescription} title={transaction.description || ''}>
                {transaction.description || '-'}
                {transaction.isInstallment && transaction.installments && (
                  <span className={styles.installmentBadge} title={t('transactions.installmentBadge').replace('{count}', transaction.installments.length.toString())}>
                    {' '}📅×{transaction.installments.length}
                  </span>
                )}
              </span>

              <span className={styles.transactionCategory} title={translateCategory(transaction.category)}>
                {translateCategory(transaction.category)}
              </span>

              <span className={styles.transactionAmount}>
                {getTransactionAmountDisplay(transaction)}
              </span>

              <div className={styles.transactionActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditClick(transaction)}
                  title={t('common.edit')}
                >
                  ✎
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteClick(transaction.id)}
                  title={t('common.delete')}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modal} onClick={handleCancel}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              {editingTransaction ? t('transactions.editTransaction') : t('transactions.addTransaction')}
            </div>
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};
