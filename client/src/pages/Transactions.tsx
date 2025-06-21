import {
  Box,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import AddTransaction from "../components/transactions/AddTransaction";
import SyncTransactions from "../components/transactions/SyncTransactions";
import TransactionsTable from "../components/transactions/TransactionsTable";

function Transactions() {
  const [reload, setReload] = useState<boolean>(false);
  const [month, setMonth] = useState<string>();

  return (
    <Stack spacing="3rem">
      <Box>
        <Heading as="h1" size="xl">
          Transactions
        </Heading>
        <Text>All transactions across all linked accounts</Text>
      </Box>
      <Box width="266px">
        <FormControl>
          <FormLabel>Filter by Month</FormLabel>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Month"
          />
        </FormControl>
      </Box>
      <TransactionsTable reload={reload} setReload={setReload} month={month} />
      <ButtonGroup spacing={4}>
        <AddTransaction setReload={setReload} />
        <SyncTransactions setReload={setReload} />
      </ButtonGroup>
    </Stack>
  );
}

export default Transactions;
