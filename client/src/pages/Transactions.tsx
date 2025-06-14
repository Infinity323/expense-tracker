import { Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";
import AddTransaction from "../components/transactions/AddTransaction";
import SyncTransactions from "../components/transactions/SyncTransactions";
import TransactionsTable from "../components/transactions/TransactionsTable";

function Transactions() {
  const [reload, setReload] = useState(false);

  return (
    <>
      <Heading as="h1" size="xl">
        Transactions
      </Heading>
      <br />
      <TransactionsTable reload={reload} setReload={setReload} />
      <br />
      <Stack direction="row" spacing={4}>
        <AddTransaction setReload={setReload} />
        <SyncTransactions setReload={setReload} />
      </Stack>
    </>
  );
}

export default Transactions;
