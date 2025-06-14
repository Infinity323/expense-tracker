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
import { useQuery } from "react-query";
import { getBudgetComparison } from "../../services/budgetService";
import ComparisonProgress from "./comparison-progress/ComparisonProgress";

function CurrentMonthBudgetComparison() {
  const { data, isLoading } = useQuery({
    queryKey: ["budgetComparison"],
    queryFn: getBudgetComparison,
  });

  return (
    <Card p="1rem">
      <CardHeader>
        <Heading size="lg">Income</Heading>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <Box p="1rem">
            <Skeleton height={20} />
          </Box>
        ) : data?.income?.length ? (
          data.income.map((comparison) => (
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
        ) : data?.expenses?.length ? (
          data.expenses.map((comparison) => (
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
