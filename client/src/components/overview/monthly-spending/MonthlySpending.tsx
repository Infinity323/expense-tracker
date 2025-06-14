import {
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useBudgetComparison } from "../../../hooks/useBudgetComparison";
import { COLOR_MAP } from "../../../utils/ColorUtil";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import { useQuery } from "react-query";
import { getCurrentMonthSpending } from "../../../services/trendsService";

interface MonthlySpendingProps {}

const MonthlySpending: React.FC<MonthlySpendingProps> = (props) => {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["currentMonthSpending"],
    queryFn: getCurrentMonthSpending,
  });

  const renderLabel = ({ value }) => formatCurrency(value);

  if (isLoading) {
    return (
      <Card p="1.5rem" variant="outline">
        <CardHeader>
          <Heading size="lg">Spending Categories</Heading>
        </CardHeader>
        <CardBody>
          <Skeleton height="40vh" />
        </CardBody>
      </Card>
    );
  }

  if (!expenses) {
    return (
      <Card p="1.5rem" variant="outline">
        <CardHeader>
          <Heading size="lg">Spending Categories</Heading>
        </CardHeader>
        <CardBody>
          <Text>No spending data found.</Text>
        </CardBody>
      </Card>
    );
  }

  const data = expenses.map((expense) => ({
    name: expense.category,
    value: expense.amount,
  }));

  return (
    <Card p="1.5rem" variant="outline">
      <CardHeader>
        <Heading size="lg">Spending Categories</Heading>
      </CardHeader>
      <CardBody>
        <Center width="100%" height="40vh">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={120}
                paddingAngle={5}
                labelLine
                label={renderLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </Center>
      </CardBody>
    </Card>
  );
};

export default MonthlySpending;
