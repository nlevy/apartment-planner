import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateTotalInitialFunds } from '../../utils/calculations';
import { useCurrencyFormatter } from '../../utils/useCurrencyFormatter';
import { useDateFormatter } from '../../utils/useDateFormatter';
import { useTranslation } from '../../i18n';
import { CheckpointDialog } from './CheckpointDialog';
import styles from './InitialFunds.module.css';

export const InitialFunds: React.FC = () => {
  const { state, updateInitialFunds, clearCheckpoint } = useAppContext();
  const { t, translateInitialFundsCategory } = useTranslation();
  const { formatCurrency } = useCurrencyFormatter();
  const { formatDate } = useDateFormatter();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCheckpointDialog, setShowCheckpointDialog] = useState(false);

  const handleAmountChange = (category: string, value: string) => {
    const amount = value ? parseFloat(value) : 0;
    updateInitialFunds({
      ...state.initialFunds,
      [category]: amount
    });
  };

  const handleDeleteCategory = (category: string) => {
    const newFunds = { ...state.initialFunds };
    delete newFunds[category];
    updateInitialFunds(newFunds);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      updateInitialFunds({
        ...state.initialFunds,
        [newCategoryName.trim()]: 0
      });
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleCancelAdd = () => {
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const total = calculateTotalInitialFunds(state.initialFunds);

  const handleCreateCheckpoint = () => {
    setShowCheckpointDialog(true);
  };

  const handleClearCheckpoint = () => {
    if (window.confirm(t('messages.confirmClearCheckpoint'))) {
      clearCheckpoint();
      alert(t('messages.checkpointCleared'));
    }
  };

  const hasData = state.transactions.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.fundsList}>
        {Object.entries(state.initialFunds).map(([category, amount]) => (
          <div key={category} className={styles.fundItem}>
            <span className={styles.fundLabel}>{translateInitialFundsCategory(category)}:</span>
            <input
              type="number"
              className={styles.fundInput}
              value={amount}
              onChange={(e) => handleAmountChange(category, e.target.value)}
              min="0"
              step="1000"
            />
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteCategory(category)}
              title={t('common.delete')}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {isAddingCategory ? (
        <div className={styles.newCategoryInput}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={t('initialFunds.addCategory')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory();
              } else if (e.key === 'Escape') {
                handleCancelAdd();
              }
            }}
            autoFocus
          />
          <button className={styles.confirmButton} onClick={handleAddCategory}>
            ✓
          </button>
          <button className={styles.cancelButton} onClick={handleCancelAdd}>
            ✕
          </button>
        </div>
      ) : (
        <button className={styles.addButton} onClick={() => setIsAddingCategory(true)}>
          + {t('initialFunds.addCategory')}
        </button>
      )}

      <div className={styles.total}>
        <span>{t('initialFunds.total')}:</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <div className={styles.checkpointSection}>
        {state.checkpoint ? (
          <div className={styles.checkpointInfo}>
            <div className={styles.checkpointHeader}>
              <span className={styles.checkpointIcon}>📍</span>
              <span className={styles.checkpointTitle}>{t('timeline.checkpoint')}</span>
            </div>
            <div className={styles.checkpointDetails}>
              <div className={styles.checkpointDetail}>
                <span className={styles.checkpointLabel}>{t('checkpoint.checkpointDate')}:</span>
                <span>{formatDate(state.checkpoint.date)}</span>
              </div>
              <div className={styles.checkpointDetail}>
                <span className={styles.checkpointLabel}>{t('checkpoint.currentBalance')}:</span>
                <span>{formatCurrency(state.checkpoint.balance)}</span>
              </div>
            </div>
            <div className={styles.checkpointActions}>
              <button
                className={styles.updateCheckpointButton}
                onClick={handleCreateCheckpoint}
              >
                {t('common.edit')}
              </button>
              <button
                className={styles.clearCheckpointButton}
                onClick={handleClearCheckpoint}
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        ) : (
          <button
            className={styles.createCheckpointButton}
            onClick={handleCreateCheckpoint}
            disabled={!hasData}
            title={!hasData ? t('transactions.emptyState') : ''}
          >
            📍 {t('toolbar.createCheckpoint')}
          </button>
        )}
      </div>

      {showCheckpointDialog && (
        <CheckpointDialog onClose={() => setShowCheckpointDialog(false)} />
      )}
    </div>
  );
};
