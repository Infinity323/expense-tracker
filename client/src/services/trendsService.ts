import { CurrentMonthExpense } from "@backend/types/currentMonthExpense";
import { IncomeVsExpenses } from "@backend/types/incomeVsExpenses";
import { SpendingOverTime } from "@backend/types/spendingOverTime";
import { get } from "./httpService";

const TRENDS_API = "/api/trends";

export const getSpendingOverTime = async ({ queryKey }: any) => {
  const [, { division, groupBy }] = queryKey;
  return await get<SpendingOverTime[]>({
    uri: `${TRENDS_API}/spending/over-time`,
    params: {
      division,
      groupBy,
    },
  });
};

export const getSpendingByCategory = async ({ queryKey }: any) => {
  const [, { division, groupBy }] = queryKey;
  return await get({
    uri: `${TRENDS_API}/spending/by-category`,
    params: {
      division,
      groupBy,
    },
  });
};

export const getIncomeVsExpenses = async () =>
  await get<IncomeVsExpenses[]>({ uri: `${TRENDS_API}/income-vs-expenses` });

export const getCurrentMonthSpending = async () =>
  await get<CurrentMonthExpense[]>({
    uri: `${TRENDS_API}/spending/current-month`,
  });
