import { Box, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";
import AddTransaction from "../components/transactions/AddTransaction";
import SyncTransactions from "../components/transactions/SyncTransactions";
import TransactionsTable from "../components/transactions/TransactionsTable";

function Transactions() {
  const [reload, setReload] = useState(false);

  return (
    <Box padding="7rem">
      <Heading as="h1" size="lg">
        Transactions
      </Heading>
      <br />
      <TransactionsTable reload={reload} setReload={setReload} />
      <br />
      <Stack direction="row" spacing={4}>
        <AddTransaction setReload={setReload} />
        <SyncTransactions />
      </Stack>
    </Box>
  );
}

export default Transactions;
