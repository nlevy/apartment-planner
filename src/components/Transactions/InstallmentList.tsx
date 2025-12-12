import React, { useState } from 'react';
import { Installment } from '../../types';
import styles from './InstallmentList.module.css';

interface InstallmentListProps {
  installments: Installment[];
  onChange: (installments: Installment[]) => void;
}

export const InstallmentList: React.FC<InstallmentListProps> = ({
  installments,
  onChange,
}) => {
  const [newDate, setNewDate] = useState<string>('');
  const [newPercentage, setNewPercentage] = useState<string>('');

  const totalPercentage = installments.reduce(
    (sum, inst) => sum + inst.percentage,
    0
  );

  const isValid = Math.abs(totalPercentage - 100) < 0.01;

  const handleAdd = () => {
    if (!newDate || !newPercentage) {
      alert('נא למלא תאריך ואחוז');
      return;
    }

    const percentage = parseFloat(newPercentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      alert('אחוז חייב להיות בין 0 ל-100');
      return;
    }

    const newInstallment: Installment = {
      id: Date.now().toString(),
      date: new Date(newDate),
      percentage,
    };

    onChange([...installments, newInstallment].sort((a, b) =>
      a.date.getTime() - b.date.getTime()
    ));
    setNewDate('');
    setNewPercentage('');
  };

  const handleDelete = (id: string) => {
    onChange(installments.filter((inst) => inst.id !== id));
  };

  const handleUpdate = (id: string, field: 'date' | 'percentage', value: string) => {
    onChange(
      installments.map((inst) => {
        if (inst.id !== id) return inst;

        if (field === 'date') {
          const newDate = new Date(value);
          // Only update if the date is valid
          if (!isNaN(newDate.getTime())) {
            return { ...inst, date: newDate };
          }
          return inst;
        } else {
          const percentage = parseFloat(value);
          if (!isNaN(percentage)) {
            return { ...inst, percentage };
          }
        }
        return inst;
      }).sort((a, b) => a.date.getTime() - b.date.getTime())
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>תשלומי פריסה</span>
        <span className={totalPercentage === 0 ? styles.neutral : isValid ? styles.valid : styles.invalid}>
          סה"כ: {totalPercentage.toFixed(1)}%
          {totalPercentage > 0 && (isValid ? ' ✓' : ' ✗')}
        </span>
      </div>

      {installments.length > 0 && (
        <div className={styles.list}>
          {installments.map((inst) => {
            const dateValue = inst.date && !isNaN(inst.date.getTime())
              ? inst.date.toISOString().split('T')[0]
              : '';

            return (
              <div key={inst.id} className={styles.installmentItem}>
                <input
                  type="date"
                  value={dateValue}
                  onChange={(e) => handleUpdate(inst.id, 'date', e.target.value)}
                  className={styles.dateInput}
                />
                <input
                  type="number"
                  value={inst.percentage}
                  onChange={(e) => handleUpdate(inst.id, 'percentage', e.target.value)}
                  className={styles.percentageInput}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className={styles.percentSign}>%</span>
                <button
                  type="button"
                  onClick={() => handleDelete(inst.id)}
                  className={styles.deleteButton}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.addSection}>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className={styles.dateInput}
          placeholder="תאריך"
        />
        <input
          type="number"
          value={newPercentage}
          onChange={(e) => setNewPercentage(e.target.value)}
          className={styles.percentageInput}
          placeholder="אחוז"
          min="0"
          max="100"
          step="0.1"
        />
        <span className={styles.percentSign}>%</span>
        <button
          type="button"
          onClick={handleAdd}
          className={styles.addButton}
        >
          + הוסף
        </button>
      </div>

      {!isValid && totalPercentage > 0 && (
        <div className={styles.warning}>
          סכום האחוזים חייב להיות 100% בדיוק
        </div>
      )}
    </div>
  );
};
