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
import { formatCurrency } from "../../utils/CurrencyUtil";

function CurrentMonthBudgetComparison() {
  const { comparisons, isLoading } = useBudgetComparison();

  if (isLoading) {
    return (
      <Card p="1.5rem" variant="outline">
        <CardHeader>
          <Heading size="lg">Budgets</Heading>
        </CardHeader>
        <CardBody>
          <Skeleton height={200} />
        </CardBody>
      </Card>
    );
  }

  if (!comparisons) {
    return (
      <Card p="1.5rem" variant="outline">
        <CardHeader>
          <Heading size="lg">Budgets</Heading>
        </CardHeader>
        <CardBody>
          <Text>No budgets found.</Text>
        </CardBody>
      </Card>
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
    <Card p="1.5rem" variant="outline">
      <CardHeader>
        <Heading size="lg">Budgets</Heading>
      </CardHeader>
      <CardHeader>
        <Heading size="md">Income</Heading>
        <Text>Total Budgeted: {formatCurrency(totalIncomeBudget)}</Text>
        <Text>Total Earned: {formatCurrency(totalIncomeActual)}</Text>
      </CardHeader>
      <CardBody>
        {comparisons?.income?.length ? (
          comparisons.income.map((comparison) => (
            <ComparisonProgress comparison={comparison} type="income" />
          ))
        ) : (
          <Box p="1rem">
            <Text>No income data to show.</Text>
          </Box>
        )}
      </CardBody>
      <Divider borderColor="gray.200" marginTop={5} marginBottom={5} />
      <CardHeader>
        <Heading as="h3" size="md">
          Spending
        </Heading>
        <Text>Total Budgeted: {formatCurrency(totalExpenseBudget)}</Text>
        <Text>Total Spent: {formatCurrency(totalExpenseActual)}</Text>
      </CardHeader>
      <CardBody>
        {comparisons?.expenses?.length ? (
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
