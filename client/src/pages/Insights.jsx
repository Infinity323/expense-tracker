import { Box, Heading } from "@chakra-ui/react";
import CategorySpendingOverTimeChart from "../components/trends/CategorySpendingOverTimeChart";
import IncomeVsSpendingOverTime from "../components/trends/IncomeVsSpendingOverTime";

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
