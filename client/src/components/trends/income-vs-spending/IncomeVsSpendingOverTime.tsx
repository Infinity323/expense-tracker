import {
  Box,
  Card,
  CardBody,
  Flex,
  Skeleton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getIncomeVsExpenses } from "../../../services/trendsService";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import { dateToMMMYYYY, dateToString } from "../../../utils/DateUtil";

function IncomeVsSpendingOverTime() {
  const { data, isLoading } = useQuery({
    queryKey: ["incomeVsExpenses"],
    queryFn: getIncomeVsExpenses,
  });

  if (isLoading) {
    return (
      <Box>
        <Skeleton height={300} />
      </Box>
    );
  }

  if (!data?.length) {
    return (
      <Box p="1.5rem">
        <Text>No data available.</Text>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        margin={{ top: 50, left: 50, right: 50, bottom: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={dateToMMMYYYY} />
        <YAxis
          domain={["auto", "auto"]}
          tickFormatter={(value, _) => formatCurrency(value)}
        />
        <Legend />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "black", opacity: 0.2 }}
        />
        <Bar dataKey="Income" stroke="green" fill="green" />
        <Bar dataKey="Expenses" stroke="red" fill="red" />
      </BarChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = (props) => {
  const { active, payload, label } = props;

  if (active && payload && payload.length) {
    return (
      <Card>
        <CardBody>
          <Text as="b">{dateToString(Number(label))}</Text>
          <Flex color="green">
            <Text>Income</Text>
            <Spacer marginLeft={2} marginRight={2} />
            <Text>{formatCurrency(payload[0]?.value)}</Text>
          </Flex>
          <Flex color="red">
            <Text>Expenses</Text>
            <Spacer marginLeft={2} marginRight={2} />
            <Text>{formatCurrency(payload[1]?.value)}</Text>
          </Flex>
        </CardBody>
      </Card>
    );
  }
};

export default IncomeVsSpendingOverTime;
