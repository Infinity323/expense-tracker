import { Box } from "@chakra-ui/react";
import AddTransaction from "../components/transactions/AddTransaction";
import TransactionsTable from "../components/transactions/TransactionsTable";

function Transactions() {
  return (
    <Box padding="7rem">
      <TransactionsTable />
      <AddTransaction />
    </Box>
  );
}

export default Transactions;
