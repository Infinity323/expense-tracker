import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import AddTransaction from "../components/transactions/AddTransaction";
import SyncTransactions from "../components/transactions/SyncTransactions";
import TransactionsTable from "../components/transactions/TransactionsTable";

function Transactions() {
  const [reload, setReload] = useState(false);

  return (
    <Stack spacing="3rem">
      <Box>
        <Heading as="h1" size="xl">
          Transactions
        </Heading>
        <Text>All transactions across all linked accounts</Text>
      </Box>
      <TransactionsTable reload={reload} setReload={setReload} />
      <Stack direction="row" spacing={4}>
        <AddTransaction setReload={setReload} />
        <SyncTransactions setReload={setReload} />
      </Stack>
    </Stack>
  );
}

export default Transactions;
