import axios from "axios";

const BUDGET_API = "/api/budget";

export const getBudgets = async (sorted) => {
  try {
    const response = await axios.get(BUDGET_API, {
      params: {
        sorted: sorted,
      },
    });
    return response.data;
  } catch (err) {}
};

export const postBudget = async (budget) => {
  try {
    const response = await axios.post(BUDGET_API, budget);
    return response.data;
  } catch (err) {}
};

export const putBudget = async (budgetDoc) => {
  try {
    const response = await axios.put(BUDGET_API, budgetDoc);
    return response.data;
  } catch (err) {}
};

export const deleteBudget = async (id, rev) => {
  try {
    const response = await axios.delete(`${BUDGET_API}/${id}/${rev}`);
    return response.data;
  } catch (err) {}
};
