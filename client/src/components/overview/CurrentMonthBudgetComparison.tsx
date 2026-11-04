import {
  Box,
  Card,
  Heading,
  Skeleton,
  Text,
  Separator,
} from "@chakra-ui/react";
import { useBudgetComparison } from "../../hooks/useBudgetComparison";
import ComparisonProgress from "./comparison-progress/ComparisonProgress";
import { formatCurrency } from "../../utils/CurrencyUtil";

function CurrentMonthBudgetComparison() {
  const { comparisons, isLoading } = useBudgetComparison();

  if (isLoading) {
    return (
      <Card.Root p="1.5rem" variant="outline">
        <Card.Header>
          <Heading size="lg">Budgets</Heading>
        </Card.Header>
        <Card.Body>
          <Skeleton height={200} />
        </Card.Body>
      </Card.Root>
    );
  }

  if (!comparisons) {
    return (
      <Card.Root p="1.5rem" variant="outline">
        <Card.Header>
          <Heading size="lg">Budgets</Heading>
        </Card.Header>
        <Card.Body>
          <Text>No budgets found.</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  const totalIncomeBudget = comparisons.income
    ?.map((comparison) => comparison.expectedAmount)
    .reduce((sum, current) => sum + current, 0);
  const totalIncomeActual = comparisons.income
    ?.map((comparison) => comparison.actualAmount)
    .reduce((sum, current) => sum + current, 0);
  const totalExpenseBudget = comparisons.expenses
    ?.map((comparison) => comparison.expectedAmount)
    .reduce((sum, current) => sum + current, 0);
  const totalExpenseActual = comparisons.expenses
    ?.map((comparison) => comparison.actualAmount)
    .reduce((sum, current) => sum + current, 0);

  return (
    <Card.Root p="1.5rem" variant="outline">
      <Card.Header>
        <Heading size="lg">Budgets</Heading>
      </Card.Header>
      <Card.Header>
        <Heading size="md">Income</Heading>
        <Text>Total Budgeted: {formatCurrency(totalIncomeBudget)}</Text>
        <Text>Total Earned: {formatCurrency(totalIncomeActual)}</Text>
      </Card.Header>
      <Card.Body>
        {comparisons?.income?.length ? (
          comparisons.income.map((comparison) => (
            <ComparisonProgress comparison={comparison} type="income" />
          ))
        ) : (
          <Box p="1rem">
            <Text>No income data to show.</Text>
          </Box>
        )}
      </Card.Body>
      <Separator borderColor="gray.200" marginTop={5} marginBottom={5} />
      <Card.Header>
        <Heading as="h3" size="md">
          Spending
        </Heading>
        <Text>Total Budgeted: {formatCurrency(totalExpenseBudget)}</Text>
        <Text>Total Spent: {formatCurrency(totalExpenseActual)}</Text>
      </Card.Header>
      <Card.Body>
        {comparisons?.expenses?.length ? (
          comparisons.expenses.map((comparison) => (
            <ComparisonProgress comparison={comparison} type="expense" />
          ))
        ) : (
          <Box padding="1rem" width="50%">
            No spending data to show.
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
}

export default CurrentMonthBudgetComparison;
