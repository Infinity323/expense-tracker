import { Button } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { DbContext } from "../../DbContext";
import { syncTransactions } from "../../services/TransactionService";

function SyncTransactions() {
  const db = useContext(DbContext);

  const [transactions, setTransactions] = useState();

  const sync = async () => {
    let itemId = "zydPwP97l1FkRBpyrqAdSKpaDaRnNNioqklnr"; // TODO: change
    await db.createIndex({
      index: { fields: ["type"] },
    });
    await db.createIndex({
      index: { fields: ["itemId"] },
    });
    let result = await db.find({
      selector: {
        type: "accessToken",
        itemId: itemId,
      },
    });
    if (result.docs && result.docs.length) {
      setTransactions(syncTransactions(itemId, result.docs[0].accessToken));
    }
  };

  return (
    <>
      <Button colorScheme="teal" onClick={sync}>
        Refresh
      </Button>
      {JSON.stringify(transactions)}
    </>
  );
}

export default SyncTransactions;
