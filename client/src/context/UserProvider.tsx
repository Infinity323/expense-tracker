import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { getAccessTokens } from "../services/linkService";
import { AccessToken } from "../types/accessToken";
import { useAuth } from "react-oidc-context";

type UserContextType = {
  accessTokens: AccessToken[];
  setAccessTokens: React.Dispatch<React.SetStateAction<AccessToken[]>>;
};

const defaultUserContext: UserContextType = {
  accessTokens: [],
  setAccessTokens: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  const { data } = useQuery({
    queryKey: ["accessTokens"],
    queryFn: getAccessTokens,
    enabled: isAuthenticated,
  });

  const [accessTokens, setAccessTokens] = useState<AccessToken[]>();

  useEffect(() => {
    if (data) {
      setAccessTokens(data);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ accessTokens, setAccessTokens }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, useUserContext };
