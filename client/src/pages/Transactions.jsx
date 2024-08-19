import { Box } from "@chakra-ui/react";
import { useState } from "react";
import AddTransaction from "../components/transactions/AddTransaction";
import SyncTransactions from "../components/transactions/SyncTransactions";
import TransactionsTable from "../components/transactions/TransactionsTable";

function Transactions() {
  const [reload, setReload] = useState(false);

  return (
    <Box padding="7rem">
      <TransactionsTable reload={reload} setReload={setReload} />
      <AddTransaction setReload={setReload} />
      <SyncTransactions />
    </Box>
  );
}

export default Transactions;
