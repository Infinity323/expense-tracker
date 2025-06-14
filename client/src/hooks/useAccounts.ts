import { useQuery } from "react-query";
import { getAccounts } from "../services/accountsService";

export const useAccounts = () => {
  const {
    data: accounts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  return { accounts, isLoading, isError, refetch };
};
