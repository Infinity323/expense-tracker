import { useQuery } from "react-query";
import { getLinkedInstitutions } from "../services/institutionService";

export const useLinkedInstitutions = () => {
  const { data: institutions, isLoading } = useQuery({
    queryKey: ["linkedInstitutions"],
    queryFn: getLinkedInstitutions,
  });

  return { institutions, isLoading };
};
