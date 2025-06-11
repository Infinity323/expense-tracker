import { BudgetDoc } from "@backend/db/types/budgetDoc";
import { BudgetComparison } from "@backend/types/budgetComparison";
import { SortedBudgets } from "@backend/types/sortedBudgets";
import axios from "axios";
import { get } from "./httpService";

const BUDGET_API = "/api/budget";

export const getBudgets = async () =>
  await get<BudgetDoc[]>({
    uri: BUDGET_API,
  });

export const getSortedBudgets = async () =>
  await get<SortedBudgets>({
    uri: BUDGET_API,
    params: {
      sorted: true,
    },
  });

export const getBudgetComparison = async () =>
  await get<BudgetComparison>({ uri: `${BUDGET_API}/comparison` });

export const postBudget = async (budget) => {
  const response = await axios.post(BUDGET_API, budget);
  return response.data;
};

export const putBudget = async (budgetDoc) => {
  const response = await axios.put(BUDGET_API, budgetDoc);
  return response.data;
};

export const deleteBudget = async (id, rev) => {
  const response = await axios.delete(`${BUDGET_API}/${id}/${rev}`);
  return response.data;
};
