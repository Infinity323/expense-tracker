export interface BudgetComparison {
  income: Comparison[];
  expenses: Comparison[];
}

export interface Comparison {
  name: string;
  expectedAmount: number;
  actualAmount: number;
  difference: number;
}
