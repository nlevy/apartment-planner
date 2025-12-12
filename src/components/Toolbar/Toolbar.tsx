import React, { useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateTimeline } from '../../utils/calculations';
import { exportToExcel } from '../../utils/excelExport';
import { downloadJSON, importFromJSON } from '../../utils/storage';
import { Settings } from '../Settings/Settings';
import { useTranslation } from '../../i18n';
import styles from './Toolbar.module.css';

export const Toolbar: React.FC = () => {
  const { state, loadState, resetState } = useAppContext();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportExcel = () => {
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

    const excelTranslations = {
      appTitle: t('common.appTitle'),
      prices: t('excel.prices'),
      buyPrice: t('priceConfig.buyPrice'),
      sellPrice: t('priceConfig.sellPrice'),
      notSet: t('excel.notSet'),
      initialBalance: t('initialFunds.title'),
      totalInitial: t('excel.totalInitial'),
      summaryTitle: t('excel.summaryTitle'),
      totalIncome: t('excel.totalIncome'),
      totalPayments: t('excel.totalPayments'),
      finalBalance: t('excel.finalBalance'),
      summary: t('excel.summary'),
      timeline: t('excel.timeline'),
      transactions: t('excel.transactions'),
      date: t('common.date'),
      event: t('excel.event'),
      category: t('transactions.category'),
      amount: t('transactions.amount'),
      balance: t('timeline.balance'),
      type: t('transactions.type'),
      description: t('transactions.description'),
      amountType: t('transactions.amountType'),
      percentageBase: t('excel.percentageBase'),
      income: t('transactions.income'),
      payment: t('transactions.payment'),
      amountTypeFixed: t('excel.amountTypeFixed'),
      amountTypePercentage: t('excel.amountTypePercentage'),
    };

    exportToExcel(timeline, state, excelTranslations);
  };

  const handleExportJSON = () => {
    downloadJSON(state);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = importFromJSON(content);

        // Confirm before overriding current data
        const hasCurrentData = state.transactions.length > 0 ||
                               Object.values(state.initialFunds).some(amount => amount > 0);

        if (hasCurrentData) {
          const confirmImport = window.confirm(t('messages.confirmImport'));
          if (!confirmImport) {
            return;
          }
        }

        loadState(imported);
        alert(t('messages.importSuccess'));
      } catch (error) {
        alert(t('messages.importError'));
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (window.confirm(t('messages.confirmReset'))) {
      resetState();
    }
  };

  const hasData = state.transactions.length > 0;

  return (
    <div className={styles.toolbar}>
      <button
        className={`${styles.button} ${styles.exportButton}`}
        onClick={handleExportExcel}
        disabled={!hasData}
        title={t('toolbar.exportExcel')}
      >
        📊 {t('toolbar.exportExcel')}
      </button>

      <button
        className={styles.button}
        onClick={handleExportJSON}
        title={t('toolbar.exportJSON')}
      >
        💾 {t('toolbar.exportJSON')}
      </button>

      <button
        className={`${styles.button} ${styles.importButton}`}
        onClick={handleImportClick}
        title={t('toolbar.importJSON')}
      >
        📁 {t('toolbar.importJSON')}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className={styles.fileInput}
      />

      <button
        className={`${styles.button} ${styles.resetButton}`}
        onClick={handleReset}
        title={t('toolbar.reset')}
      >
        🗑️ {t('toolbar.reset')}
      </button>

      <Settings />
    </div>
  );
};
