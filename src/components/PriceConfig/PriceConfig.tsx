import React from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './PriceConfig.module.css';

export const PriceConfig: React.FC = () => {
  const { state, updatePriceConfig } = useAppContext();

  const handleBuyPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updatePriceConfig({ buyPrice: value ? parseFloat(value) : null });
  };

  const handleSellPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updatePriceConfig({ sellPrice: value ? parseFloat(value) : null });
  };

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="buyPrice">
          מחיר קניה
        </label>
        <input
          id="buyPrice"
          type="number"
          className={styles.input}
          value={state.priceConfig.buyPrice ?? ''}
          onChange={handleBuyPriceChange}
          placeholder="0"
          min="0"
          step="1000"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="sellPrice">
          מחיר מכירה
        </label>
        <input
          id="sellPrice"
          type="number"
          className={styles.input}
          value={state.priceConfig.sellPrice ?? ''}
          onChange={handleSellPriceChange}
          placeholder="0"
          min="0"
          step="1000"
        />
      </div>
    </div>
  );
};
