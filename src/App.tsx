import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import { PriceConfig } from './components/PriceConfig/PriceConfig'
import { InitialFunds } from './components/InitialFunds/InitialFunds'
import { TransactionsPanel } from './components/Transactions/TransactionsPanel'
import { TimelineTable } from './components/Timeline/TimelineTable'
import { BalanceGraph } from './components/Graph/BalanceGraph'
import { Toolbar } from './components/Toolbar/Toolbar'
import styles from './App.module.css'

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <div className={styles.app}>
          <header className={styles.header}>
            מתכנן קניית ומכירת דירה
          </header>

          <Toolbar />

          <div className={styles.mainGrid}>
            <div className={styles.leftColumn}>
              <div className={`${styles.panel} ${styles.panelFixed}`}>
                <h3>מחירים</h3>
                <PriceConfig />
              </div>

              <div className={`${styles.panel} ${styles.panelScrollable}`}>
                <h3>יתרה התחלתית</h3>
                <div className={styles.scrollContainer}>
                  <InitialFunds />
                </div>
              </div>
            </div>

            <div className={`${styles.panel} ${styles.panelScrollable}`}>
              <h3>תנועות</h3>
              <div className={styles.scrollContainer}>
                <TransactionsPanel />
              </div>
            </div>

            <div className={`${styles.panel} ${styles.panelScrollable}`}>
              <h3>ציר זמן</h3>
              <div className={styles.scrollContainer}>
                <TimelineTable />
              </div>
            </div>
          </div>

          <div className={styles.graphContainer}>
            <h3>יתרה לאורך זמן</h3>
            <BalanceGraph />
          </div>
        </div>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
