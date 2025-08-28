export interface DashboardOverviewDTO {
  totalCustomers: number;
  totalAccounts: number;
  totalUsers: number;
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransactions: number;
  averageAccountBalance: number;
  activeAccountsCount: number;
  suspendedAccountsCount: number;
  createdAccounts: number;
  closedAccounts: number;
  blockedAccounts: number;
}

export interface MonthlyStatsDTO {
  month: string;
  newCustomers: number;
  newAccounts: number;
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  netFlow: number;
}

export interface AccountTypeStatsDTO {
  accountType: string;
  count: number;
  totalBalance: number;
  percentage: number;
}

export interface TopCustomersDTO {
  customerId: number;
  customerName: string;
  email: string;
  accountsCount: number;
  totalBalance: number;
  transactionsCount: number;
}

export interface AlertDTO {
  type: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
  actionRequired: string;
}

export interface RiskAnalysisDTO {
  riskLevel: 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ';
  accountsCount: number;
  exposureAmount: number;
  riskFactors: string[];
}

export interface PerformanceMetricsDTO {
  customerSatisfactionScore: number;
  systemUptime: number;
  transactionSuccessRate: number;
  averageResponseTime: number;
  dailyActiveUsers: number;
}