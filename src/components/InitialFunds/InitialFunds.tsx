import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateTotalInitialFunds } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import styles from './InitialFunds.module.css';

export const InitialFunds: React.FC = () => {
  const { state, updateInitialFunds } = useAppContext();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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

  return (
    <div className={styles.container}>
      <div className={styles.fundsList}>
        {Object.entries(state.initialFunds).map(([category, amount]) => (
          <div key={category} className={styles.fundItem}>
            <span className={styles.fundLabel}>{category}:</span>
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
              title="מחק"
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
            placeholder="שם הקטגוריה"
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
          + הוסף קטגוריה
        </button>
      )}

      <div className={styles.total}>
        <span>סה"כ:</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};
