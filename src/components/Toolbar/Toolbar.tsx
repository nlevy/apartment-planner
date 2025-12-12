import React, { useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateTimeline } from '../../utils/calculations';
import { exportToExcel } from '../../utils/excelExport';
import { downloadJSON, importFromJSON } from '../../utils/storage';
import { ThemeSelector } from './ThemeSelector';
import { LanguageSelector } from './LanguageSelector';
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
    exportToExcel(timeline, state);
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
                               state.initialFunds.cash > 0 ||
                               state.initialFunds.savings > 0;

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

      <ThemeSelector />

      <LanguageSelector />

      <button
        className={`${styles.button} ${styles.resetButton}`}
        onClick={handleReset}
        title={t('toolbar.reset')}
      >
        🗑️ {t('toolbar.reset')}
      </button>
    </div>
  );
};
