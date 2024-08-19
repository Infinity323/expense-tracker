import { Button } from "@chakra-ui/react";
import { syncTransactions } from "../../services/TransactionService";

function SyncTransactions() {
  const sync = async () => {
    let accessTokens = JSON.parse(sessionStorage.getItem("accessTokens"));
    accessTokens.forEach((entry) => {
      syncTransactions(entry.itemId, entry.accessToken);
    });
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
