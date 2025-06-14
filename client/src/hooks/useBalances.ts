import { useQuery } from "react-query";
import { getBalances } from "../services/itemService";

export const useBalances = () => {
  const {
    data: balances,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["balances"],
    queryFn: getBalances,
  });
  return { balances, isLoading, isError };
};
