import React, { useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateTimeline } from '../../utils/calculations';
import { exportToExcel } from '../../utils/excelExport';
import { downloadJSON, importFromJSON } from '../../utils/storage';
import { ThemeSelector } from './ThemeSelector';
import styles from './Toolbar.module.css';

export const Toolbar: React.FC = () => {
  const { state, loadState, resetState } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportExcel = () => {
    const timeline = generateTimeline(
      state.initialFunds,
      state.transactions,
      state.priceConfig
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
          const confirmImport = window.confirm(
            'ייבוא הקובץ ידרוס את כל הנתונים הנוכחיים. האם להמשיך?'
          );
          if (!confirmImport) {
            return;
          }
        }

        loadState(imported);
        alert('הנתונים יובאו בהצלחה!');
      } catch (error) {
        alert('שגיאה בייבוא הקובץ. אנא ודא שהקובץ תקין.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'האם אתה בטוח שברצונך לאפס את כל הנתונים? פעולה זו לא ניתנת לביטול.'
      )
    ) {
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
        title="ייצוא לאקסל"
      >
        📊 ייצוא לאקסל
      </button>

      <button
        className={styles.button}
        onClick={handleExportJSON}
        title="ייצוא ל-JSON"
      >
        💾 ייצוא JSON
      </button>

      <button
        className={`${styles.button} ${styles.importButton}`}
        onClick={handleImportClick}
        title="ייבוא מ-JSON"
      >
        📁 ייבוא JSON
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className={styles.fileInput}
      />

      <ThemeSelector />

      <button
        className={`${styles.button} ${styles.resetButton}`}
        onClick={handleReset}
        title="איפוס כל הנתונים"
      >
        🗑️ איפוס
      </button>
    </div>
  );
};
