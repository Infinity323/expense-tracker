import { useQuery } from "react-query";
import { getBudgets } from "../services/budgetService";

export const useBudgets = () => {
  const {
    data: budgets,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets,
  });

  return { budgets, isLoading, isError, refetch };
};
