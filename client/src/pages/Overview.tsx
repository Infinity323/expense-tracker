import { Box, Heading, HStack, Stack } from "@chakra-ui/react";
import CurrentMonthBudgetComparison from "../components/overview/CurrentMonthBudgetComparison";
import NetWorth from "../components/overview/net-worth/NetWorth";

function Overview() {
  return (
    <Stack spacing="3rem">
      <Heading as="h2" size="xl">
        Net Worth
      </Heading>
      <NetWorth />
      <Heading as="h2" size="xl">
        Monthly Income and Expenses
      </Heading>
      <HStack spacing="2rem">
        <Box width="50%">
          <CurrentMonthBudgetComparison />
        </Box>
      </HStack>
    </Stack>
  );
}

export default Overview;
