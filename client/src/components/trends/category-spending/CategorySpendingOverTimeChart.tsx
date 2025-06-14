import { Box, Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getSortedBudgets } from "../../../services/budgetService";
import { getSpendingOverTime } from "../../../services/trendsService";
import { dateToString } from "../../../utils/DateUtil";
import { COLOR_MAP } from "../../../utils/ColorUtil";
import { formatCurrency } from "../../../utils/CurrencyUtil";

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

  return (
    <ResponsiveContainer width="100%" height={500}>
      {categoryIsLoading || spendingIsLoading ? (
        <Skeleton />
      ) : (
        <AreaChart
          data={spendingData}
          margin={{ top: 50, left: 50, right: 50, bottom: 50 }}
        >
          <defs>
            {categories.map((category) => (
              <linearGradient
                id={`color${category.replace(" ", "")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={COLOR_MAP[category]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={COLOR_MAP[category]}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number"
            domain={["auto", "auto"]}
            tickFormatter={dateToString}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value, _) => formatCurrency(value)}
          />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
          {spendingData &&
            categories &&
            categories.map((category) => (
              <>
                <Area
                  dataKey={category}
                  // dot={false}
                  stroke={COLOR_MAP[category]}
                  strokeWidth={2}
                  fill={`url(#color${category.replace(" ", "")})`}
                />
              </>
            ))}
        </AreaChart>
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
