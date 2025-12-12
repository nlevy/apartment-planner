import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { generateTimeline } from '../../utils/calculations';
import { formatDate } from '../../utils/formatters';
import { useCurrencyFormatter } from '../../utils/useCurrencyFormatter';
import { useTranslation } from '../../i18n';
import { useLocale } from '../../context/LocaleContext';
import styles from './Graph.module.css';

type XAxisMode = 'event' | 'date';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: Date;
      description: string;
      runningBalance: number;
    };
  }>;
  formatCurrency: (amount: number) => string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, formatCurrency }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{formatDate(data.date)}</div>
        <div className={styles.tooltipValue}>{formatCurrency(data.runningBalance)}</div>
        <div className={styles.tooltipDescription}>{data.description}</div>
      </div>
    );
  }
  return null;
};

const formatYAxis = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1000000) {
    return `${sign}${(absValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    return `${sign}${(absValue / 1000).toFixed(0)}K`;
  }
  return `${sign}${absValue.toFixed(0)}`;
};

export const BalanceGraph: React.FC = () => {
  const { state } = useAppContext();
  const { t } = useTranslation();
  const { formatCurrency } = useCurrencyFormatter();
  const { language } = useLocale();
  const [xAxisMode, setXAxisMode] = useState<XAxisMode>('event');

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
      <div className={styles.container}>
        <div className={styles.emptyState}>
          {t('graph.emptyState')}
        </div>
      </div>
    );
  }

  const chartData = timeline.map((entry) => ({
    date: entry.date,
    timestamp: entry.date.getTime(),
    dateFormatted: formatDate(entry.date),
    balance: entry.runningBalance,
    description: entry.description,
    runningBalance: entry.runningBalance
  }));

  const minBalance = Math.min(...timeline.map((e) => e.runningBalance));
  const maxBalance = Math.max(...timeline.map((e) => e.runningBalance));
  const balanceRange = maxBalance - minBalance;
  const yAxisMin = minBalance < 0 ? minBalance - balanceRange * 0.1 : 0;
  const yAxisMax = maxBalance + balanceRange * 0.1;

  const transactionDates = state.transactions.map(t => t.date.getTime());
  const installmentDates = state.transactions
    .filter(t => t.isInstallment && t.installments)
    .flatMap(t => t.installments!.map(inst => inst.date.getTime()));
  const allTransactionTimestamps = [...transactionDates, ...installmentDates];

  const minTimestamp = allTransactionTimestamps.length > 0
    ? Math.min(...allTransactionTimestamps)
    : chartData[0]?.timestamp || Date.now();
  const maxTimestamp = allTransactionTimestamps.length > 0
    ? Math.max(...allTransactionTimestamps)
    : chartData[chartData.length - 1]?.timestamp || Date.now();

  const timeRange = maxTimestamp - minTimestamp;
  const xAxisDomainMin = minTimestamp - timeRange * 0.05;
  const xAxisDomainMax = maxTimestamp + timeRange * 0.05;

  const formatXAxisTick = (value: number): string => {
    if (xAxisMode === 'date') {
      return formatDate(new Date(value));
    }
    return value.toString();
  };

  const toggleXAxisMode = () => {
    setXAxisMode((prev) => (prev === 'event' ? 'date' : 'event'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.toggleContainer}>
          {language === 'he' ? (
            <>
              <span className={`${styles.toggleLabel} ${xAxisMode === 'date' ? styles.active : ''}`}>
                {t('common.date')}
              </span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={xAxisMode === 'date'}
                  onChange={toggleXAxisMode}
                  className={styles.toggleInput}
                />
                <span className={styles.toggleSlider}></span>
              </label>
              <span className={`${styles.toggleLabel} ${xAxisMode === 'event' ? styles.active : ''}`}>
                {t('common.event')}
              </span>
            </>
          ) : (
            <>
              <span className={`${styles.toggleLabel} ${xAxisMode === 'event' ? styles.active : ''}`}>
                {t('common.event')}
              </span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={xAxisMode === 'date'}
                  onChange={toggleXAxisMode}
                  className={styles.toggleInput}
                />
                <span className={styles.toggleSlider}></span>
              </label>
              <span className={`${styles.toggleLabel} ${xAxisMode === 'date' ? styles.active : ''}`}>
                {t('common.date')}
              </span>
            </>
          )}
        </div>
      </div>
      <div className={styles.graphWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            {xAxisMode === 'event' ? (
              <XAxis
                dataKey="dateFormatted"
                stroke="#757575"
                style={{ fontSize: '12px' }}
              />
            ) : (
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={[xAxisDomainMin, xAxisDomainMax]}
                stroke="#757575"
                style={{ fontSize: '12px' }}
                tickFormatter={formatXAxisTick}
                scale="time"
              />
            )}
            <YAxis
              stroke="#757575"
              style={{ fontSize: '12px' }}
              tickFormatter={formatYAxis}
              domain={[yAxisMin, yAxisMax]}
              width={65}
              tick={{ dx: -5 }}
            />
            <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={() => t('graph.balance')}
            />
            <ReferenceLine y={0} stroke="#F44336" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2196F3"
              strokeWidth={2}
              dot={{ fill: '#2196F3', r: 4 }}
              activeDot={{ r: 6 }}
              name={t('graph.balance')}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
