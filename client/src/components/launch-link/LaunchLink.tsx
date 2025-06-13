import { Button } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useUserContext } from "../../context/UserProvider";
import { updateItem } from "../../services/itemService";
import { postAccessToken, postLink } from "../../services/linkService";
import { AccessToken } from "../../types/accessToken";

interface LaunchLinkProps {
  children: ReactNode;
  linkToken: string;
  itemId?: string;
}

const LaunchLink: React.FC<LaunchLinkProps> = (props) => {
  const { linkToken, children, itemId } = props;
  const { setAccessTokens } = useUserContext();

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
    },
  });

  const onClick = () => open();

  return (
    <Button onClick={onClick} disabled={!ready}>
      {children}
    </Button>
  );
};

export default LaunchLink;
