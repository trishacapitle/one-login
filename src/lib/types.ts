export interface JobItem {
  id: string;
  userId: string;
  customer: string;
  description: string;
  amount: number;
  completedAt: string;
  createdAt: string;
}

export interface ExpenseItem {
  id: string;
  userId: string;
  category: string;
  description: string;
  amount: number;
  incurredAt: string;
  createdAt: string;
}

export interface FinancialPosition {
  moneyIn: number;
  moneyOut: number;
  profit: number;
  isInTheBlack: boolean;
}

export interface CreateJobInput {
  customer: string;
  description: string;
  amount: number;
}
