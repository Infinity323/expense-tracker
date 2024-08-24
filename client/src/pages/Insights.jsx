import { Box, Heading } from "@chakra-ui/react";
import CategorySpendingOverTimeChart from "../components/trends/CategorySpendingOverTimeChart";

function Insights() {
  return (
    <>
      <Box padding="5rem">
        <Heading as="h2" size="lg">
          Spending Trends
        </Heading>
        <Heading as="h3" size="md">
          Monthly Spending By Category
        </Heading>
        <CategorySpendingOverTimeChart />
      </Box>
    </>
  );
}

export default Insights;
