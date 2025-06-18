import { Button } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useUserContext } from "../../context/UserProvider";
import { useAccounts } from "../../hooks/useAccounts";
import { updateItem } from "../../services/itemService";
import { postAccessToken } from "../../services/linkService";
import { AccessToken } from "../../types/accessToken";

interface LaunchLinkProps {
  children: ReactNode;
  linkToken: string;
  itemId?: string;
  colorScheme?: string;
}

const LaunchLink: React.FC<LaunchLinkProps> = (props) => {
  const { linkToken, children, itemId, colorScheme } = props;
  const { setAccessTokens } = useUserContext();
  const { refetch } = useAccounts();

  const onSuccess = async (publicToken, metadata) => {
    if (!itemId) {
      const accessTokenResponse = await postAccessToken(publicToken, metadata);
      setAccessTokens((prev: AccessToken[]) => [...prev, accessTokenResponse]);
    } else {
      await updateItem(itemId, metadata);
    }
    refetch();
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  const onClick = () => open();

  return (
    <Button colorScheme={colorScheme} onClick={onClick} disabled={!ready}>
      {children}
    </Button>
  );
};

export default LaunchLink;
