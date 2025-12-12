import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType, AmountType, PercentageBase, Installment } from '../../types';
import { formatDateForInput } from '../../utils/formatters';
import { InstallmentList } from './InstallmentList';
import { useTranslation } from '../../i18n';
import styles from './Transactions.module.css';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation();

  const CATEGORY_KEYS = [
    'downPayment',
    'payment',
    'brokerage',
    'purchaseTax',
    'mortgage',
    'lawyer',
    'renovation',
    'municipalTax',
    'other'
  ];

  const [type, setType] = useState<TransactionType>(transaction?.type || 'payment');
  const [date, setDate] = useState(
    transaction?.date ? formatDateForInput(transaction.date) : formatDateForInput(new Date())
  );
  const [amountType, setAmountType] = useState<AmountType>(transaction?.amountType || 'fixed');
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [percentageBase, setPercentageBase] = useState<PercentageBase>(
    transaction?.percentageBase || 'buy'
  );
  const [description, setDescription] = useState(transaction?.description || '');
  const [category, setCategory] = useState(transaction?.category || '');
  const [isInstallment, setIsInstallment] = useState(transaction?.isInstallment || false);
  const [installments, setInstallments] = useState<Installment[]>(
    transaction?.installments || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate installments if in installment mode
    if (isInstallment) {
      if (installments.length === 0) {
        alert(t('messages.addAtLeastOneInstallment'));
        return;
      }

      const totalPercentage = installments.reduce(
        (sum, inst) => sum + inst.percentage,
        0
      );

      if (Math.abs(totalPercentage - 100) >= 0.01) {
        alert(t('messages.totalPercentageMustBe100'));
        return;
      }
    }

    const transactionData: Transaction = {
      id: transaction?.id || uuidv4(),
      type,
      date: new Date(date),
      amountType,
      amount: parseFloat(amount) || 0,
      percentageBase: amountType === 'percentage' ? percentageBase : undefined,
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      isInstallment: isInstallment || undefined,
      installments: isInstallment && installments.length > 0 ? installments : undefined
    };

    onSubmit(transactionData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>{t('transactions.type')}</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              value="payment"
              checked={type === 'payment'}
              onChange={(e) => setType(e.target.value as TransactionType)}
            />
            <span>{t('transactions.payment')}</span>
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              value="income"
              checked={type === 'income'}
              onChange={(e) => setType(e.target.value as TransactionType)}
            />
            <span>{t('transactions.income')}</span>
          </label>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="date">
          {isInstallment ? t('transactions.startDate') : t('transactions.date')}
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isInstallment}
            onChange={(e) => setIsInstallment(e.target.checked)}
          />
          <span>{t('transactions.installments')}</span>
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>{t('transactions.amountType')}</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioOption}>
            <input
              type="radio"
              value="fixed"
              checked={amountType === 'fixed'}
              onChange={(e) => setAmountType(e.target.value as AmountType)}
            />
            <span>{t('transactions.fixedAmount')}</span>
          </label>
          <label className={styles.radioOption}>
            <input
              type="radio"
              value="percentage"
              checked={amountType === 'percentage'}
              onChange={(e) => setAmountType(e.target.value as AmountType)}
            />
            <span>{t('transactions.percentageAmount')}</span>
          </label>
        </div>
      </div>

      {amountType === 'fixed' ? (
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="amount">
            {t('transactions.amount')}
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="100"
          />
        </div>
      ) : (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="percentage">
              {t('transactions.percentage')}
            </label>
            <input
              id="percentage"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="percentageBase">
              {t('transactions.percentageBase')}
            </label>
            <select
              id="percentageBase"
              value={percentageBase}
              onChange={(e) => setPercentageBase(e.target.value as PercentageBase)}
            >
              <option value="buy">{t('priceConfig.buyPrice')}</option>
              <option value="sell">{t('priceConfig.sellPrice')}</option>
            </select>
          </div>
        </>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="category">
          {t('transactions.category')}
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">{t('transactions.selectCategory')}</option>
          {CATEGORY_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(`transactions.categories.${key}`)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="description">
          {t('transactions.description')}
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('transactions.description')}
        />
      </div>

      {isInstallment && (
        <div className={styles.formGroup}>
          <InstallmentList
            installments={installments}
            onChange={setInstallments}
          />
        </div>
      )}

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button type="submit" className={styles.submitButton}>
          {transaction ? t('common.update') : t('common.add')}
        </button>
      </div>
    </form>
  );
};
