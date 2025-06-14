import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useBudgetComparison } from "../../hooks/useBudgetComparison";
import ComparisonProgress from "./comparison-progress/ComparisonProgress";

function CurrentMonthBudgetComparison() {
  const { comparisons, isLoading } = useBudgetComparison();

  return (
    <Card p="1.5rem" variant="outline">
      <CardHeader>
        <Heading size="lg">Income</Heading>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <Box p="1rem">
            <Skeleton height={20} />
          </Box>
        ) : comparisons?.income?.length ? (
          comparisons.income.map((comparison) => (
            <ComparisonProgress comparison={comparison} type="income" />
          ))
        ) : (
          <Box p="1rem">
            <Text>No income data to show.</Text>
          </Box>
        )}
      </CardBody>
      <Divider borderColor="gray.200" />
      <CardHeader>
        <Heading as="h3" size="lg">
          Spending
        </Heading>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <Box p="1rem">
            <Skeleton height={20} />
          </Box>
        ) : comparisons?.expenses?.length ? (
          comparisons.expenses.map((comparison) => (
            <ComparisonProgress comparison={comparison} type="expense" />
          ))
        ) : (
          <Box padding="1rem" width="50%">
            No spending data to show.
          </Box>
        )}
      </CardBody>
    </Card>
  );
}

export default CurrentMonthBudgetComparison;
