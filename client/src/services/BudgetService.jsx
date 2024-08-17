import axios from "axios";

export const getBudgets = async () => {
  try {
    const response = await axios.get("/api/budget");
    return response.data;
  } catch (err) {}
};

export const postBudget = async (budget) => {
  try {
    const data = {
      category: budget.category,
      subcategory: budget.subcategory,
      amount: budget.amount,
    };
    const response = await axios.post("/api/budget", data);
    return response.data;
  } catch (err) {}
};

export const deleteBudget = async (id, rev) => {
  try {
    const response = await axios.delete(`/api/budget/${id}/${rev}`);
    return response.data;
  } catch (err) {}
};
