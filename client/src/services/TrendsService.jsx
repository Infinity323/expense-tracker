import axios from "axios";

const TRENDS_API = "/api/trends";

export const getSpendingOverTime = async ({ division, groupBy }) => {
  try {
    const response = await axios.get(`${TRENDS_API}/spending/over-time`, {
      params: {
        division: division,
        groupBy: groupBy,
      },
    });
    return response.data;
  } catch (err) {}
};

export const getSpendingByCategory = async ({ division, groupBy }) => {
  try {
    const response = await axios.get(`${TRENDS_API}/spending/by-category`, {
      params: {
        division: division,
        groupBy: groupBy,
      },
    });
    return response.data;
  } catch (err) {}
};
