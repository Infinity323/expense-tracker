import { Box } from "@chakra-ui/react";
import AddBudget from "../components/AddBudget";
import BudgetsTable from "../components/BudgetsTable";

function Budgets() {
  return (
    <Box padding="7rem">
      <BudgetsTable />
      <AddBudget />
    </Box>
  );
}

export default Budgets;
