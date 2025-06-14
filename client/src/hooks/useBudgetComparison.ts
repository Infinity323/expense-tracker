import { useQuery } from "react-query";
import { getBudgetComparison } from "../services/budgetService";

export const useBudgetComparison = () => {
  const {
    data: comparisons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["budgetComparison"],
    queryFn: getBudgetComparison,
  });

  return { comparisons, isLoading, isError };
};
