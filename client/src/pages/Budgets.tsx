import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import AddBudget from "../components/budgets/AddBudget";
import BudgetsTable from "../components/budgets/BudgetsTable";

function Budgets() {
  const [reload, setReload] = useState(false);

  return (
    <Stack spacing="3rem">
      <Box>
        <Heading as="h1" size="xl">
          Budgets
        </Heading>
        <Text>All configured income and expense budgets</Text>
      </Box>
      <BudgetsTable reload={reload} setReload={setReload} />
      <Box>
        <AddBudget setReload={setReload} />
      </Box>
    </Stack>
  );
}

export default Budgets;
