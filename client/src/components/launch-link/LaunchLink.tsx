import { Button } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useUserContext } from "../../context/UserProvider";
import { updateItem } from "../../services/itemService";
import { postAccessToken, postLink } from "../../services/linkService";
import { AccessToken } from "../../types/accessToken";
import { useAccounts } from "../../hooks/useAccounts";

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

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      if (!itemId) {
        await postLink(metadata);
        const accessTokenResponse = await postAccessToken(publicToken);
        setAccessTokens((prev: AccessToken[]) => [
          ...prev,
          accessTokenResponse,
        ]);
      } else {
        await updateItem(itemId, metadata);
      }
      refetch();
    },
  });

  const onClick = () => open();

  return (
    <Button colorScheme={colorScheme} onClick={onClick} disabled={!ready}>
      {children}
    </Button>
  );
};

export default LaunchLink;
