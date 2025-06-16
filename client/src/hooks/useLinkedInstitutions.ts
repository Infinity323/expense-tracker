import { useQuery } from "react-query";
import { getLinkedInstitutions } from "../services/institutionService";

export const useLinkedInstitutions = () => {
  const { data: institutions } = useQuery({
    queryKey: ["linkedInstitutions"],
    queryFn: getLinkedInstitutions,
  });

  return { institutions };
};
