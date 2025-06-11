export interface BudgetComparison {
  income: Comparison[];
  expenses: Comparison[];
}

interface Comparison {
  name: string;
  expectedAmount: number;
  actualAmount: number;
  difference: number;
}
