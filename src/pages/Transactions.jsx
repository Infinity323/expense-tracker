import { Box } from "@chakra-ui/react";
import AddTransaction from "../components/transactions/AddTransaction";
import TransactionsTable from "../components/transactions/TransactionsTable";
import SyncTransactions from "../components/transactions/SyncTransactions";

function Transactions() {
  return (
    <Box padding="7rem">
      <TransactionsTable />
      <AddTransaction />
      <SyncTransactions />
    </Box>
  );
}

export default Transactions;
