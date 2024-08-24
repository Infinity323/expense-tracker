import { Box, Skeleton, Text } from "@chakra-ui/react";
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
import { useApiData } from "../../hooks/UseApiData";
import { getIncomeVsExpenses } from "../../services/TrendsService";
import { dateToString } from "../shared/LineChartShared";

function IncomeVsSpendingOverTime() {
  const [data, isLoading, error] = useApiData({
    apiCall: getIncomeVsExpenses(),
  });

  return (
    <ResponsiveContainer width="100%" height={500}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <AreaChart
          data={data}
          margin={{ top: 50, left: 50, right: 50, bottom: 50 }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="green" stopOpacity={0.8} />
              <stop offset="95%" stopColor="green" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="red" stopOpacity={0.8} />
              <stop offset="95%" stopColor="red" stopOpacity={0} />
            </linearGradient>
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
            tickFormatter={(value, _) => `$${value}`}
          />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
          <Area
            dataKey="Income"
            stroke="green"
            strokeWidth={2}
            fill="url(#colorIncome)"
          />
          <Area
            dataKey="Expenses"
            stroke="red"
            strokeWidth={2}
            fill="url(#colorExpenses)"
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" rounded="md" boxShadow="md" padding="1rem">
        <Text as="b">{dateToString(Number(label))}</Text>
        <Text>Total Income: ${payload[0] ? payload[0].value : 0}</Text>
        <Text>Total Expenses: ${payload[1] ? payload[1].value : 0}</Text>
      </Box>
    );
  }
}

export default IncomeVsSpendingOverTime;
