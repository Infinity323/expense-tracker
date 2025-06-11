import { Box, Heading } from "@chakra-ui/react";
import { useState } from "react";
import AddBudget from "../components/budgets/AddBudget";
import BudgetsTable from "../components/budgets/BudgetsTable";

function Budgets() {
  const [reload, setReload] = useState(false);

  return (
    <Box padding="7rem">
      <Heading as="h1" size="lg">
        Budgets
      </Heading>
      <br />
      <BudgetsTable reload={reload} setReload={setReload} />
      <br />
      <AddBudget setReload={setReload} />
    </Box>
  );
}

export default Budgets;
