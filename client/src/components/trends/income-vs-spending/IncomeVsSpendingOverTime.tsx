import { Box, Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getIncomeVsExpenses } from "../../../services/trendsService";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import { dateToMMMYYYY, dateToString } from "../../../utils/DateUtil";

function IncomeVsSpendingOverTime() {
  const { data, isLoading } = useQuery({
    queryKey: ["incomeVsExpenses"],
    queryFn: getIncomeVsExpenses,
  });

  return (
    <ResponsiveContainer width="100%" height={500}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <BarChart
          data={data}
          margin={{ top: 50, left: 50, right: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={dateToMMMYYYY}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value, _) => formatCurrency(value)}
          />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="Income"
            stroke="green"
            fill="green"
          />
          <Bar
            dataKey="Expenses"
            stroke="red"
            fill="red"
          />
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
        <Text>Total Income: {formatCurrency(payload[0]?.value)}</Text>
        <Text>Total Expenses: {formatCurrency(payload[1]?.value)}</Text>
      </Box>
    );
  }
}

export default IncomeVsSpendingOverTime;
