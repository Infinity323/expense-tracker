import { Heading } from "@chakra-ui/react";
import CategorySpendingOverTimeChart from "../components/trends/category-spending/CategorySpendingOverTimeChart";
import IncomeVsSpendingOverTime from "../components/trends/income-vs-spending/IncomeVsSpendingOverTime";

function Insights() {
  return (
    <>
      <Heading as="h2" size="xl">
        Spending Trends
      </Heading>
      <br />
      <Heading as="h3" size="lg">
        Monthly Cash Flow
      </Heading>
      <IncomeVsSpendingOverTime />
      <Heading as="h3" size="lg">
        Monthly Expenses By Category
      </Heading>
      <CategorySpendingOverTimeChart />
    </>
  );
}

export default Insights;
