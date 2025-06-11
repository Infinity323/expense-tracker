import { Box, Heading } from "@chakra-ui/react";
import CurrentMonthBudgetComparison from "../components/overview/CurrentMonthBudgetComparison";

function Overview() {
  return (
    <Box padding="5rem">
      <Heading as="h2" size="xl">
        This month at a glance
      </Heading>
      <br />
      <CurrentMonthBudgetComparison />
    </Box>
  );
}

export default Overview;
