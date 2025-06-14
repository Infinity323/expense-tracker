import { Box, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import CurrentMonthBudgetComparison from "../components/overview/CurrentMonthBudgetComparison";
import MonthlySpending from "../components/overview/monthly-spending/MonthlySpending";
import NetWorth from "../components/overview/net-worth/NetWorth";

function Overview() {
  return (
    <Stack spacing="3rem">
      <Box>
        <Heading as="h2" size="xl">
          Net Worth
        </Heading>
        <Text>A summary of assets and liabilities</Text>
      </Box>
      <NetWorth />
      <Box>
        <Heading as="h2" size="xl">
          Monthly Overview
        </Heading>
        <Text>A summary of this month's income and expenses</Text>
      </Box>
      <HStack spacing="2rem">
        <Box width="50%">
          <CurrentMonthBudgetComparison />
        </Box>
        <Box width="50%">
          <MonthlySpending />
        </Box>
      </HStack>
    </Stack>
  );
}

export default Overview;
