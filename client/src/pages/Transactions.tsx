import {
  Box,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  NativeSelect,
  Stack,
  Text,
  Field,
} from "@chakra-ui/react";
import { useState } from "react";
import AddTransaction from "../components/transactions/AddTransaction";
import SyncTransactions from "../components/transactions/SyncTransactions";
import TagFilterInput from "../components/transactions/TagFilterInput";
import TransactionsTable from "../components/transactions/TransactionsTable";
import { useAccounts } from "../hooks/useAccounts";

function Transactions() {
  const [reload, setReload] = useState<boolean>(false);
  const [month, setMonth] = useState<string>();
  const [accountId, setAccountId] = useState("all");
  const [tag, setTag] = useState("");
  const { flattenedAccounts } = useAccounts();
  const selectTag = (selectedTag: string) => {
    setTag(selectedTag);
  };

  return (
    <Stack gap="3rem">
      <Box>
        <Heading as="h1" size="3xl">
          Transactions
        </Heading>
        <Text>All transactions across all linked accounts</Text>
      </Box>
      <Flex gap={4} align="flex-end" wrap="wrap">
        <Box width={{ base: "100%", sm: "266px" }}>
          <Field.Root>
            <Field.Label>Filter by Month</Field.Label>
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="Month"
            />
          </Field.Root>
        </Box>
        <TagFilterInput selectedTag={tag} onSelect={selectTag} />
        <Box width={{ base: "100%", sm: "266px" }}>
          <Field.Root>
            <Field.Label>Filter by Account</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={accountId}
                onChange={(event) => setAccountId(event.target.value)}
              >
                <option value="all">All accounts</option>
                <option value="manual">Manual transactions</option>
                {flattenedAccounts.map((account) => (
                  <option key={account.account_id} value={account.account_id}>
                    {account.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Box>
        <ButtonGroup
          gap={4}
          marginLeft={{ base: 0, lg: "auto" }}
          width={{ base: "100%", sm: "auto" }}
          justifyContent="flex-end"
        >
          <AddTransaction setReload={setReload} />
          <SyncTransactions setReload={setReload} />
        </ButtonGroup>
      </Flex>
      <TransactionsTable
        reload={reload}
        setReload={setReload}
        month={month}
        accountId={accountId}
        tag={tag || undefined}
        onTagSelect={selectTag}
      />
    </Stack>
  );
}

export default Transactions;
