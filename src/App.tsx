import { LocaleProvider } from './context/LocaleContext'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import { PriceConfig } from './components/PriceConfig/PriceConfig'
import { InitialFunds } from './components/InitialFunds/InitialFunds'
import { TransactionsPanel } from './components/Transactions/TransactionsPanel'
import { TimelineTable } from './components/Timeline/TimelineTable'
import { BalanceGraph } from './components/Graph/BalanceGraph'
import { Toolbar } from './components/Toolbar/Toolbar'
import { useTranslation } from './i18n'
import styles from './App.module.css'

function AppContent() {
  const { t } = useTranslation();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        {t('common.appTitle')}
      </header>

      <Toolbar />

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <div className={`${styles.panel} ${styles.panelFixed}`}>
            <h3>{t('priceConfig.title')}</h3>
            <PriceConfig />
          </div>

          <div className={`${styles.panel} ${styles.panelScrollable}`}>
            <h3>{t('initialFunds.title')}</h3>
            <div className={styles.scrollContainer}>
              <InitialFunds />
            </div>
          </div>
        </div>

        <div className={`${styles.panel} ${styles.panelScrollable}`}>
          <h3>{t('transactions.title')}</h3>
          <div className={styles.scrollContainer}>
            <TransactionsPanel />
          </div>
        </div>

        <div className={`${styles.panel} ${styles.panelScrollable}`}>
          <h3>{t('timeline.title')}</h3>
          <div className={styles.scrollContainer}>
            <TimelineTable />
          </div>
        </div>
      </div>

      <div className={styles.graphContainer}>
        <h3>{t('graph.title')}</h3>
        <BalanceGraph />
      </div>
    </div>
  );
}

function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </LocaleProvider>
  )
}

export default App
