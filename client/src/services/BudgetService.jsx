import axios from "axios";

const BUDGET_API = "/api/budget";

export const getBudgets = async (sorted) => {
  const response = await axios.get(BUDGET_API, {
    params: {
      sorted: sorted,
    },
  });
  return response.data;
};

export const getBudgetComparison = async () => {
  const response = await axios.get(`${BUDGET_API}/comparison`);
  return response.data;
};

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
