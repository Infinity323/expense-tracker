import { Comparison } from "@backend/types/budgetComparison";
import { Box, Flex, Heading, Progress, Spacer, Text } from "@chakra-ui/react";
import { formatCurrency } from "../../../utils/CurrencyUtil";

interface ComparisonProgressProps {
  comparison: Comparison;
  type: "income" | "expense";
}

const ComparisonProgress: React.FC<ComparisonProgressProps> = (props) => {
  const { comparison, type } = props;

  const multiplier = type === "income" ? -1 : 1;

  const getStatusColor = (difference) => {
    return difference > 0 ? "green" : "red";
  };

  const calculateProgress = (expected, actual) => {
    return Math.min((Math.max(actual, 0) / expected) * 100, 100);
  };

  return (
    <Box p="0.5rem" key={comparison.name}>
      <Flex>
        <Heading as="h4" fontSize="md">
          {comparison.name}
        </Heading>
        <Spacer />
        <Text>{formatCurrency(comparison.expectedAmount)}</Text>
      </Flex>
      <Progress
        colorScheme={getStatusColor(multiplier * comparison.difference)}
        size="md"
        value={calculateProgress(
          comparison.expectedAmount,
          comparison.actualAmount
        )}
      />
      <Flex>
        <Text as="span" fontSize="md">
          {formatCurrency(comparison.actualAmount)} this month
        </Text>
        <Spacer />
        <Text
          as="span"
          color={getStatusColor(multiplier * comparison.difference)}
        >
          {` (${formatCurrency(Math.abs(comparison.difference))} ${
            comparison.difference > 0 ? "under" : "over"
          })`}
        </Text>
      </Flex>
    </Box>
  );
};

export default ComparisonProgress;
