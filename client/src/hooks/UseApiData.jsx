import { useEffect, useState } from "react";

export const useApiData = ({ apiCall }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState();
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
