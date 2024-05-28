import { Box } from "@chakra-ui/react";
import AddTransaction from "../components/AddTransaction";
import TransactionsTable from "../components/TransactionsTable";

function Transactions() {
  return (
    <Box padding="7rem">
      <TransactionsTable />
      <AddTransaction />
    </Box>
  );
}

export default Transactions;
