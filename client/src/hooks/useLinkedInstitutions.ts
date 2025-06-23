import { useQuery } from "react-query";
import { getLinkedInstitutions } from "../services/institutionService";

export const useLinkedInstitutions = () => {
  const {
    data: institutions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["linkedInstitutions"],
    queryFn: getLinkedInstitutions,
  });

  return { institutions, isLoading, refetch };
};
