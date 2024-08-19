import { Button } from "@chakra-ui/react";
import { syncTransactions } from "../../services/TransactionService";

function SyncTransactions() {
  const sync = async () => {
    let accessTokens = sessionStorage.getItem("accessTokens");
    if (accessTokens) {
      accessTokens.forEach((accessToken, itemId) => {
        syncTransactions(itemId, accessToken);
      });
    }
  };

  return (
    <>
      <Button colorScheme="teal" onClick={sync}>
        Refresh
      </Button>
    </>
  );
}

export default SyncTransactions;
