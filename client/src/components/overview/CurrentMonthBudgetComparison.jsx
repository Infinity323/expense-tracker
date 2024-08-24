import { Box, Heading, Progress, Text } from "@chakra-ui/react";
import { useApiData } from "../../hooks/UseApiData";
import { getBudgetComparison } from "../../services/BudgetService";

function CurrentMonthBudgetComparison() {
  const [data, loading, error] = useApiData({
    apiCall: getBudgetComparison(),
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
      {data &&
        data.income &&
        data.income.map((comparison) => (
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
        ))}
      <Heading as="h3" size="lg">
        Spending
      </Heading>
      {data &&
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
        ))}
    </>
  );
}

export default CurrentMonthBudgetComparison;
