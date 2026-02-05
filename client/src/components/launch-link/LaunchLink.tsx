import { Button } from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";
import {
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOnSuccess,
  usePlaidLink,
} from "react-plaid-link";
import { useModal } from "../../context/GlobalModalProvider";
import { useUserContext } from "../../context/UserProvider";
import { useAccounts } from "../../hooks/useAccounts";
import { useLinkedInstitutions } from "../../hooks/useLinkedInstitutions";
import { updateItem } from "../../services/itemService";
import { postAccessToken } from "../../services/linkService";
import { AccessToken } from "../../types/accessToken";

interface LaunchLinkProps {
  children: ReactNode;
  linkToken: string;
  itemId?: string;
  colorScheme?: string;
}

const LaunchLink = (props: LaunchLinkProps) => {
  const { linkToken, children, itemId, colorScheme } = props;
  const { setAccessTokens } = useUserContext();
  const { refetch: refetchAccounts } = useAccounts();
  const { refetch: refetchInstitutions } = useLinkedInstitutions();
  const { openModal } = useModal();

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, metadata) => {
      if (!itemId) {
        try {
          const accessTokenResponse = await postAccessToken(
            publicToken,
            metadata,
          );
          setAccessTokens((prev: AccessToken[]) => [
            ...prev,
            accessTokenResponse,
          ]);
        } catch {
          openModal("alert", {
            header: "Error",
            body: "The same institution cannot be linked more than once. Please update the existing institution link instead.",
            status: "error",
          });
        }
      } else {
        await updateItem(itemId, metadata);
      }
      refetchAccounts();
      refetchInstitutions();
    },
    [itemId, openModal, refetchAccounts, refetchInstitutions, setAccessTokens],
  );

  const onExit = useCallback<PlaidLinkOnExit>(
    (error, metadata) => {
      if (error?.error_code === "INVALID_LINK_TOKEN") {
        openModal("alert", {
          header: "Error",
          body: "Something went wrong. Please reload the page and try again.",
          status: "error",
        });
      } else if (error) {
        openModal("alert", {
          header: "Error",
          body: `An error occurred while linking your account(s): ${error.display_message}`,
          status: "error",
        });
      }
    },
    [openModal],
  );

  const onEvent = useCallback<PlaidLinkOnEvent>(
    (eventName, metadata) => {
      console.log(`Plaid Link event: ${eventName}`, metadata);
      if (eventName === "ERROR")
        openModal("alert", {
          header: "Error",
          body: `An error occurred while linking your account(s): ${metadata.error_message}`,
          status: "error",
        });
    },
    [openModal],
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
    onEvent,
  });

  const onClick = () => open();

  return (
    <Button colorScheme={colorScheme} onClick={onClick} disabled={!ready}>
      {children}
    </Button>
  );
};

export default LaunchLink;
