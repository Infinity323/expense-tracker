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

interface UserContext {
  userInfo?: {
    userId: string;
    firstName: string;
    lastName: string;
  };
  accessTokens: AccessToken[];
  setAccessTokens: React.Dispatch<React.SetStateAction<AccessToken[]>>;
}

const defaultUserContext: UserContext = {
  accessTokens: [],
  setAccessTokens: () => {},
};

const UserContext = createContext<UserContext>(defaultUserContext);

const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useQuery({
    queryKey: ["accessTokens"],
    queryFn: getAccessTokens,
  });

  const userInfo = {
    userId: "test",
    firstName: "First",
    lastName: "Last",
  };

  const [accessTokens, setAccessTokens] = useState<AccessToken[]>();

  useEffect(() => {
    if (data) {
      setAccessTokens(data);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ userInfo, accessTokens, setAccessTokens }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, useUserContext };
