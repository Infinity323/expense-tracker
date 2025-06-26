export interface BudgetDoc {
  budgetId: string;
  primary: string;
  detailed: string;
  description: string;
  category: string;
  subcategory: string;
  amount: number;
  isMaster: boolean;
  userId: string;
}
