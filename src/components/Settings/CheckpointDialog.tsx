import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateTimeline, calculateTotalInitialFunds } from '../../utils/calculations';
import { formatDateForInput } from '../../utils/formatters';
import { useTranslation } from '../../i18n';
import styles from './Settings.module.css';

interface CheckpointDialogProps {
  onClose: () => void;
}

export const CheckpointDialog: React.FC<CheckpointDialogProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { state, setCheckpoint } = useAppContext();

  const existingCheckpoint = state.checkpoint;
  const isEditing = !!existingCheckpoint;

  const [checkpointDate, setCheckpointDate] = useState(
    existingCheckpoint
      ? formatDateForInput(existingCheckpoint.date)
      : formatDateForInput(new Date())
  );
  const [currentBalance, setCurrentBalance] = useState(
    existingCheckpoint
      ? existingCheckpoint.balance.toString()
      : ''
  );

  const timeline = generateTimeline(
    state.initialFunds,
    state.transactions,
    state.priceConfig,
    {
      initialBalance: t('timeline.initialBalance'),
      income: t('transactions.income'),
      payment: t('transactions.payment')
    }
  );

  const latestBalance = timeline.length > 0
    ? timeline[timeline.length - 1].runningBalance
    : calculateTotalInitialFunds(state.initialFunds);

  const handleCreate = () => {
    const balance = parseFloat(currentBalance);
    if (isNaN(balance)) {
      alert('Please enter a valid balance amount');
      return;
    }

    setCheckpoint({
      date: new Date(checkpointDate),
      balance
    });

    alert(t('messages.checkpointCreated'));
    onClose();
  };

  return (
    <div className={styles.dialogOverlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? t('common.edit') + ' ' + t('timeline.checkpoint') : t('checkpoint.title')}</h2>
        <p className={styles.dialogDescription}>{t('checkpoint.description')}</p>

        <div className={styles.formGroup}>
          <label className={styles.label}>{t('checkpoint.checkpointDate')}</label>
          <input
            type="date"
            value={checkpointDate}
            onChange={(e) => setCheckpointDate(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>{t('checkpoint.currentBalance')}</label>
          <input
            type="number"
            value={currentBalance}
            onChange={(e) => setCurrentBalance(e.target.value)}
            placeholder={`${t('timeline.balance')}: ${latestBalance.toLocaleString()}`}
            className={styles.input}
          />
          <small className={styles.hint}>
            {t('timeline.balance')} {t('common.appTitle').toLowerCase()}: {latestBalance.toLocaleString()}
          </small>
        </div>

        <div className={styles.dialogActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            {t('common.cancel')}
          </button>
          <button onClick={handleCreate} className={styles.submitButton}>
            {isEditing ? t('common.update') : t('checkpoint.create')}
          </button>
        </div>
      </div>
    </div>
  );
};
