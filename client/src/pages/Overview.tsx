import { Grid, GridItem, Heading } from "@chakra-ui/react";
import CurrentMonthBudgetComparison from "../components/overview/CurrentMonthBudgetComparison";

function Overview() {
  return (
    <>
      <Heading as="h2" size="xl">
        Net Worth
      </Heading>
      <Heading as="h2" size="xl">
        Monthly Income and Expenses
      </Heading>
      <br />
      <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(2, 1fr)">
        <GridItem rowSpan={1} colSpan={1}>
          <CurrentMonthBudgetComparison />
        </GridItem>
      </Grid>
    </>
  );
}

export default Overview;
