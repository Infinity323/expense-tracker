import { useEffect, useState } from "react";

// TODO: replace with useQuery
export const useApiData = ({ apiCall }) => {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState();

  useEffect(() => {
    if (apiCall) {
      const makeApiCall = async () => {
        setIsLoading(true);
        apiCall
          .then((res) => {
            setData(res);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            setError(err);
          });
      };
      makeApiCall();
    }
  }, []);

  return [data, isLoading, error];
};
