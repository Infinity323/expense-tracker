import { Box, Grid, GridItem, Heading, Stack, Text } from "@chakra-ui/react";
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
      <Grid templateColumns="repeat(2, 1fr)" gap="2rem">
        <GridItem colSpan={1}>
          <CurrentMonthBudgetComparison />
        </GridItem>
        <GridItem colSpan={1}>
          <MonthlySpending />
        </GridItem>
      </Grid>
    </Stack>
  );
}

export default Overview;
