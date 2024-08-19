import { Button } from "@chakra-ui/react";
import { syncTransactions } from "../../services/TransactionService";

function SyncTransactions() {
  const sync = async () => {
    let accessTokens = JSON.parse(sessionStorage.getItem("accessTokens"));
    if (accessTokens.size > 0) {
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
