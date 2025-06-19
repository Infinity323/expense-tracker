import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useModal } from "../../context/GlobalModalProvider";
import { useUserContext } from "../../context/UserProvider";
import { useLoadingModal } from "../../hooks/useLoadingModal";
import { syncTransactions } from "../../services/transactionService";

function SyncTransactions({ setReload }) {
  const { accessTokens } = useUserContext();
  const { openModal } = useModal();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  useLoadingModal({ isLoading: isSyncing, body: "Syncing transactions..." });

  const sync = async () => {
    setIsSyncing(true);
    for (const entry of accessTokens) {
      try {
        await syncTransactions(entry.itemId, entry.accessToken);
      } catch (err) {
        openModal("alert", {
          header: "Sync Error",
          body: "One or more of your accounts requires attention.",
        });
      }
    }
    setIsSyncing(false);
    setReload(true);
  };

  return (
    <Button
      colorScheme="teal"
      onClick={sync}
      isLoading={isSyncing}
      isDisabled={isSyncing}
    >
      Sync
    </Button>
  );
}

export default SyncTransactions;
