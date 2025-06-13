import { Doc } from "./doc";

export interface BudgetDoc extends Doc<"budget"> {
  primary: string;
  detailed: string;
  description: string;
  category: string;
  subcategory: string;
  amount: number;
  isMaster: boolean;
}
