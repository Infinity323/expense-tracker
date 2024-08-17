import { Box } from "@chakra-ui/react";
import { useState } from "react";
import AddBudget from "../components/budgets/AddBudget";
import BudgetsTable from "../components/budgets/BudgetsTable";

function Budgets() {
  const [reload, setReload] = useState(false);

  return (
    <Box padding="7rem">
      <BudgetsTable reload={reload} setReload={setReload} />
      <AddBudget setReload={setReload} />
    </Box>
  );
}

export default Budgets;
