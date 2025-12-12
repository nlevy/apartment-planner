import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateTimeline } from '../../utils/calculations';
import { formatDate, formatCurrencyWithSign, formatCurrency } from '../../utils/formatters';
import { useTranslation } from '../../i18n';
import styles from './Timeline.module.css';

export const TimelineTable: React.FC = () => {
  const { state } = useAppContext();
  const { t } = useTranslation();

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

  if (timeline.length === 0) {
    return (
      <div className={styles.emptyState}>
        {t('timeline.emptyState')}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.dateColumn}>{t('timeline.date')}</th>
            <th>{t('timeline.description')}</th>
            <th>{t('transactions.category')}</th>
            <th className={styles.amountColumn}>{t('timeline.amount')}</th>
            <th className={styles.balanceColumn}>{t('timeline.balance')}</th>
          </tr>
        </thead>
        <tbody>
          {timeline.map((entry, index) => {
            const isInitial = index === 0;
            const isNegativeBalance = entry.runningBalance < 0;

            return (
              <tr key={index} className={isInitial ? styles.initialRow : ''}>
                <td className={styles.dateColumn}>{formatDate(entry.date)}</td>
                <td>{entry.description}</td>
                <td>{entry.category || '-'}</td>
                <td
                  className={`${styles.amountColumn} ${
                    entry.amount > 0
                      ? styles.positiveAmount
                      : entry.amount < 0
                      ? styles.negativeAmount
                      : ''
                  }`}
                >
                  {isInitial ? '' : formatCurrencyWithSign(entry.amount)}
                </td>
                <td
                  className={`${styles.balanceColumn} ${
                    isNegativeBalance ? styles.negativeBalance : ''
                  }`}
                >
                  {formatCurrency(entry.runningBalance)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
