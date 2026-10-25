import { Button, useToast } from "@chakra-ui/react";
import { ReactNode, useCallback, useEffect } from "react";
import {
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOnSuccess,
  usePlaidLink,
} from "react-plaid-link";
import { useAccounts } from "../../hooks/useAccounts";
import { useLinkedInstitutions } from "../../hooks/useLinkedInstitutions";
import { useCreateLinkToken } from "../../hooks/useCreateLinkToken";
import { updateItem } from "../../services/itemService";
import { postAccessToken } from "../../services/linkService";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface LaunchLinkProps {
  children: ReactNode;
  itemId?: string;
  colorScheme?: string;
}

const LaunchLink = (props: LaunchLinkProps) => {
  const { children, itemId, colorScheme } = props;
  const {
    linkToken,
    isLoading: isLinkTokenLoading,
    isError: isLinkTokenError,
    refreshLinkToken,
  } = useCreateLinkToken({ itemId });
  const { refetch: refetchAccounts } = useAccounts();
  const { refetch: refetchInstitutions } = useLinkedInstitutions();
  const toast = useToast();

  useEffect(() => {
    if (isLinkTokenError) {
      toast({
        id: `link-token-error-${itemId ?? "new"}`,
        title: "Could not start account linking",
        description: "Please try again in a moment.",
        status: "error",
        isClosable: true,
      });
    }
  }, [isLinkTokenError, itemId, toast]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, metadata) => {
      try {
        if (!itemId) {
          await postAccessToken(publicToken, metadata);
        } else {
          await updateItem(itemId);
        }
        await Promise.all([refetchAccounts(), refetchInstitutions()]);
      } catch (error) {
        console.error(
          "[Plaid Link] backend completion failed",
          JSON.stringify({
            link_session_id: metadata.link_session_id,
            institution_id: metadata.institution?.institution_id,
            account_ids: metadata.accounts?.map((account) => account.id),
            error_name: error instanceof Error ? error.name : "UnknownError",
          }),
        );
        toast({
          title: "Could not link account",
          description: getErrorMessage(error, "Please try again."),
          status: "error",
          isClosable: true,
        });
      } finally {
        await refreshLinkToken();
      }
    },
    [itemId, refetchAccounts, refetchInstitutions, refreshLinkToken, toast],
  );

  const onExit = useCallback<PlaidLinkOnExit>(
    (error, metadata) => {
      void refreshLinkToken();
      if (error) {
        console.error(
          "[Plaid Link] exit error",
          JSON.stringify({
            error_type: error.error_type,
            error_code: error.error_code,
            request_id: metadata.request_id,
            link_session_id: metadata.link_session_id,
            institution_id: metadata.institution?.institution_id,
            account_ids: metadata.accounts?.map((account) => account.id),
            exit_status: metadata.status,
          }),
        );
      }
      if (error?.error_code === "INVALID_LINK_TOKEN") {
        toast({
          title: "Link session expired",
          description: "Reload the page and try again.",
          status: "error",
          isClosable: true,
        });
      } else if (error) {
        toast({
          title: "Could not link account",
          description: error.display_message || "Please try again.",
          status: "error",
          isClosable: true,
        });
      }
    },
    [refreshLinkToken, toast],
  );

  const onEvent = useCallback<PlaidLinkOnEvent>(
    (eventName, metadata) => {
      if (eventName === "ERROR") {
        console.error(
          "[Plaid Link] event error",
          JSON.stringify({
            error_type: metadata.error_type,
            error_code: metadata.error_code,
            request_id: metadata.request_id,
            link_session_id: metadata.link_session_id,
            institution_id: metadata.institution_id,
            account_id: metadata.account_id,
          }),
        );
        toast({
          title: "Could not link account",
          description: metadata.error_message || "Please try again.",
          status: "error",
          isClosable: true,
        });
      }
    },
    [toast],
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
    onEvent,
  });

  const onClick = () => open();

  return (
    <Button
      colorScheme={colorScheme}
      onClick={onClick}
      isDisabled={!ready || isLinkTokenLoading}
    >
      {children}
    </Button>
  );
};

export default LaunchLink;
