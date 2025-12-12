export type Language = 'he' | 'en';
export type Currency = 'ILS' | 'USD' | 'EUR';

export interface Translations {
  common: {
    appTitle: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    update: string;
    reset: string;
    event: string;
    date: string;
  };
  priceConfig: {
    title: string;
    buyPrice: string;
    sellPrice: string;
  };
  initialFunds: {
    title: string;
    total: string;
    addCategory: string;
    cash: string;
    stocks: string;
    other: string;
  };
  transactions: {
    title: string;
    addTransaction: string;
    type: string;
    payment: string;
    income: string;
    date: string;
    startDate: string;
    amount: string;
    percentage: string;
    description: string;
    category: string;
    selectCategory: string;
    amountType: string;
    fixedAmount: string;
    percentageAmount: string;
    percentageBase: string;
    installments: string;
    addInstallment: string;
    installmentDate: string;
    installmentPercentage: string;
    totalMustBe100: string;
    categories: {
      downPayment: string;
      payment: string;
      brokerage: string;
      purchaseTax: string;
      mortgage: string;
      lawyer: string;
      renovation: string;
      municipalTax: string;
      other: string;
    };
  };
  timeline: {
    title: string;
    date: string;
    description: string;
    amount: string;
    balance: string;
    initialBalance: string;
    emptyState: string;
  };
  graph: {
    title: string;
    balance: string;
    emptyState: string;
    toggleEventView: string;
    toggleDateView: string;
  };
  toolbar: {
    exportExcel: string;
    exportJSON: string;
    importJSON: string;
    reset: string;
    theme: string;
    language: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  messages: {
    confirmImport: string;
    importSuccess: string;
    importError: string;
    confirmReset: string;
    addAtLeastOneInstallment: string;
    totalPercentageMustBe100: string;
  };
}
