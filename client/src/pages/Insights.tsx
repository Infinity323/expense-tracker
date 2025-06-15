import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import CategorySpendingOverTimeChart from "../components/trends/category-spending/CategorySpendingOverTimeChart";
import IncomeVsSpendingOverTime from "../components/trends/income-vs-spending/IncomeVsSpendingOverTime";

function Insights() {
  return (
    <Stack spacing="3rem">
      <Box>
        <Heading as="h2" size="xl">
          Insights
        </Heading>
        <Text>A view of monthly cash flow and spending trends</Text>
      </Box>
      <Box>
        <Heading as="h3" size="lg">
          Monthly Cash Flow
        </Heading>
        <IncomeVsSpendingOverTime />
      </Box>
      <Box>
        <Heading as="h3" size="lg">
          Monthly Expenses By Category
        </Heading>
        <CategorySpendingOverTimeChart />
      </Box>
    </Stack>
  );
}

export default Insights;
