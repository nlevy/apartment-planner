import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateTimeline } from '../../utils/calculations';
import { formatDate, formatCurrencyWithSign, formatCurrency } from '../../utils/formatters';
import styles from './Timeline.module.css';

export const TimelineTable: React.FC = () => {
  const { state } = useAppContext();

  const timeline = generateTimeline(
    state.initialFunds,
    state.transactions,
    state.priceConfig
  );

  if (timeline.length === 0) {
    return (
      <div className={styles.emptyState}>
        אין נתונים להצגה. הוסף יתרה התחלתית ותנועות כדי לראות את ציר הזמן.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.dateColumn}>תאריך</th>
            <th>אירוע</th>
            <th>קטגוריה</th>
            <th className={styles.amountColumn}>סכום</th>
            <th className={styles.balanceColumn}>יתרה</th>
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
