import { Box, Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getSortedBudgets } from "../../../services/budgetService";
import { getSpendingOverTime } from "../../../services/trendsService";
import { COLOR_MAP } from "../../../utils/ColorUtil";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import { dateToMMMYYYY, dateToString } from "../../../utils/DateUtil";

function CategorySpendingOverTimeChart() {
  const { data: categoryData, isLoading: categoryIsLoading } = useQuery({
    queryKey: ["sortedBudgets"],
    queryFn: getSortedBudgets,
  });
  const { data: spendingData, isLoading: spendingIsLoading } = useQuery({
    queryKey: [
      "spendingOverTime",
      { groupBy: "category", division: "monthly" },
    ],
    queryFn: getSpendingOverTime,
  });

  const categories = categoryData
    ? Object.entries(categoryData).map((entry) => entry[0])
    : undefined;

  // TODO: add filter
  return (
    <ResponsiveContainer width="100%" height={800}>
      {categoryIsLoading || spendingIsLoading ? (
        <Skeleton />
      ) : (
        <BarChart
          data={spendingData}
          margin={{ top: 50, left: 50, right: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={dateToMMMYYYY} />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value, _) => formatCurrency(value)}
          />
          {/* <Legend /> */}
          <Tooltip content={<CustomTooltip />} />
          {spendingData &&
            categories &&
            categories.map((category) => (
              <>
                <Bar
                  dataKey={category}
                  stackId={0}
                  stroke={COLOR_MAP[category]}
                  fill={COLOR_MAP[category]}
                  barSize={100}
                />
              </>
            ))}
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" rounded="md" boxShadow="md" padding="1rem">
        <Text as="b">{dateToString(Number(label))}</Text>
        {payload
          .sort((a, b) => b.value - a.value)
          .map((data) => (
            <Text color={COLOR_MAP[data.name]}>
              {data.name}: {formatCurrency(data.value)}
            </Text>
          ))}
      </Box>
    );
  }
}

export default CategorySpendingOverTimeChart;
