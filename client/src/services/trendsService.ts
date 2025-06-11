import axios from "axios";

const TRENDS_API = "/api/trends";

export const getSpendingOverTime = async ({ division, groupBy }) => {
  const response = await axios.get(`${TRENDS_API}/spending/over-time`, {
    params: {
      division: division,
      groupBy: groupBy,
    },
  });
  return response.data;
};

export const getSpendingByCategory = async ({ division, groupBy }) => {
  const response = await axios.get(`${TRENDS_API}/spending/by-category`, {
    params: {
      division: division,
      groupBy: groupBy,
    },
  });
  return response.data;
};

export const getIncomeVsExpenses = async () => {
  const response = await axios.get(`${TRENDS_API}/income-vs-expenses`);
  return response.data;
};
