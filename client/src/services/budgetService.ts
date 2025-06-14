import { BudgetDoc } from "@backend/db/types/budgetDoc";
import { BudgetComparison } from "@backend/types/budgetComparison";
import { SortedBudgets } from "@backend/types/sortedBudgets";
import { delete_, get, post, put } from "./httpService";

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

export const postBudget = async (budget) =>
  await post({ uri: BUDGET_API, data: budget });

export const putBudget = async (budgetDoc) =>
  await put({ uri: BUDGET_API, data: budgetDoc });

export const deleteBudget = async (id) =>
  await delete_({ uri: `${BUDGET_API}/${id}` });
