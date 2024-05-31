import { Box } from "@chakra-ui/react";
import AddBudget from "../components/budgets/AddBudget";
import BudgetsTable from "../components/budgets/BudgetsTable";

function Budgets() {
  return (
    <Box padding="7rem">
      <BudgetsTable />
      <AddBudget />
    </Box>
  );
}

export default Budgets;
