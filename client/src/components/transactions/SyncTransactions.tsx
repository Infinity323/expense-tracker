import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useAccounts } from "../../hooks/useAccounts";
import { useLoadingModal } from "../../hooks/useLoadingModal";
import { syncTransactions } from "../../services/transactionService";

function SyncTransactions({ setReload }) {
  const { accounts } = useAccounts();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const toast = useToast();
  useLoadingModal({ isLoading: isSyncing, body: "Syncing transactions..." });

  const sync = async () => {
    setIsSyncing(true);
    let failed = 0;
    try {
      for (const account of accounts ?? []) {
        try {
          await syncTransactions(account.item_id);
        } catch {
          failed += 1;
        }
      }
      if (failed) {
        toast({
          title: "Some accounts could not sync",
          description: `${failed} of ${accounts?.length ?? 0} linked accounts need attention.`,
          status: "error",
          isClosable: true,
        });
      } else {
        toast({
          title: "Transactions synced",
          status: "success",
          isClosable: true,
        });
      }
    } finally {
      setIsSyncing(false);
      setReload(true);
    }
  };

  return (
    <Button
      colorScheme="teal"
      onClick={sync}
      isLoading={isSyncing}
      isDisabled={isSyncing || !accounts?.length}
    >
      Sync
    </Button>
  );
}

export default SyncTransactions;
