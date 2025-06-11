import { Box, Heading } from "@chakra-ui/react";
import CategorySpendingOverTimeChart from "../components/trends/category-spending/CategorySpendingOverTimeChart";
import IncomeVsSpendingOverTime from "../components/trends/income-vs-spending/IncomeVsSpendingOverTime";

function Insights() {
  return (
    <>
      <Box padding="5rem">
        <Heading as="h2" size="xl">
          Spending Trends
        </Heading>
        <br />
        <Heading as="h3" size="lg">
          Monthly Income vs Expenses
        </Heading>
        <IncomeVsSpendingOverTime />
        <Heading as="h3" size="lg">
          Monthly Expenses By Category
        </Heading>
        <CategorySpendingOverTimeChart />
      </Box>
    </>
  );
}

export default Insights;
