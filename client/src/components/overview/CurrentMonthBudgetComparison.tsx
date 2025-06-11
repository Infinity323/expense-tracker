import { Box, Heading, Progress, Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getBudgetComparison } from "../../services/budgetService";

function CurrentMonthBudgetComparison() {
  const { data, isLoading } = useQuery({
    queryKey: ["budgetComparison"],
    queryFn: getBudgetComparison,
  });

  const getStatusColor = (difference) => {
    return difference > 0 ? "green" : "red";
  };

  const calculateProgress = (expected, actual) => {
    return Math.min((actual / expected) * 100, 100);
  };

  return (
    <>
      <Heading as="h3" size="lg">
        Income
      </Heading>
      {isLoading ? (
        <Box width="50%" padding="1rem">
          <Skeleton height={20} />
        </Box>
      ) : (
        data?.income?.map((comparison) => (
          <Box padding="1rem" key={comparison.name} width="50%">
            <Heading as="h4" fontSize="md">
              {comparison.name}: ${comparison.expectedAmount}
            </Heading>
            <Progress
              colorScheme={getStatusColor(-1 * comparison.difference)}
              size="md"
              value={calculateProgress(
                comparison.expectedAmount,
                comparison.actualAmount
              )}
            />
            <Text as="span" fontSize="md">
              {`$${comparison.actualAmount} this month `}
            </Text>
            <Text as="span" color={getStatusColor(-1 * comparison.difference)}>
              {`($${Math.abs(comparison.difference)} ${
                comparison.difference > 0 ? "underbudget" : "overbudget"
              })`}
            </Text>
          </Box>
        ))
      )}
      <Heading as="h3" size="lg">
        Spending
      </Heading>
      {isLoading ? (
        <Box width="50%" padding="1rem">
          <Skeleton height={20} />
        </Box>
      ) : (
        data &&
        data.expenses &&
        data.expenses.map((comparison) => (
          <Box padding="1rem" key={comparison.name} width="50%">
            <Heading as="h4" fontSize="md">
              {comparison.name}: ${comparison.expectedAmount}
            </Heading>
            <Progress
              colorScheme={getStatusColor(comparison.difference)}
              size="md"
              value={calculateProgress(
                comparison.expectedAmount,
                comparison.actualAmount
              )}
            />
            <Text as="span" fontSize="md">
              {`$${comparison.actualAmount} this month `}
            </Text>
            <Text as="span" color={getStatusColor(comparison.difference)}>
              {`($${Math.abs(comparison.difference)} ${
                comparison.difference > 0 ? "underbudget" : "overbudget"
              })`}
            </Text>
          </Box>
        ))
      )}
    </>
  );
}

export default CurrentMonthBudgetComparison;
