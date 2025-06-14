import { Heading } from "@chakra-ui/react";
import { useState } from "react";
import AddBudget from "../components/budgets/AddBudget";
import BudgetsTable from "../components/budgets/BudgetsTable";

function Budgets() {
  const [reload, setReload] = useState(false);

  return (
    <>
      <Heading as="h1" size="xl">
        Budgets
      </Heading>
      <br />
      <BudgetsTable reload={reload} setReload={setReload} />
      <br />
      <AddBudget setReload={setReload} />
    </>
  );
}

export default Budgets;
