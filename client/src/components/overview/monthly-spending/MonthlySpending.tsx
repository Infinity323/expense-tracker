import {
  Card,
  CardBody,
  CardHeader,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Skeleton,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getCurrentMonthSpending } from "../../../services/trendsService";
import { COLOR_MAP } from "../../../utils/ColorUtil";
import { formatCurrency } from "../../../utils/CurrencyUtil";

interface MonthlySpendingProps {}

const MonthlySpending: React.FC<MonthlySpendingProps> = (props) => {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["currentMonthSpending"],
    queryFn: getCurrentMonthSpending,
  });
  const [showSubcategories, setShowSubcategories] = useState<boolean>(false);

  const categoryData = useMemo(
    () =>
      expenses
        ? Object.entries(
            expenses?.reduce((acc, expense) => {
              acc[expense.category] = acc[expense.category] || 0;
              acc[expense.category] += expense.amount;
              return acc;
            }, {} as Record<string, number>)
          )
            .map(([name, value]) => ({ name, value }))
            .filter((entry) => entry.value > 0)
        : undefined,
    [expenses]
  );

  const subcategoryData = useMemo(
    () =>
      expenses
        ? Object.entries(
            expenses?.reduce((acc, expense) => {
              const key = `${expense.category}|${expense.subcategory}`;
              acc[key] = acc[key] || 0;
              acc[key] += expense.amount;
              return acc;
            }, {} as Record<string, number>)
          )
            .map(([name, value]) => ({ name, value }))
            .filter((entry) => entry.value > 0)
        : undefined,
    [expenses]
  );

  const renderLabel = ({ value }) => formatCurrency(value);
  const renderLegendText = (value: string) =>
    showSubcategories ? value.split("|")[1] : value;

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

  if (!expenses?.length) {
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

  const data = showSubcategories ? subcategoryData : categoryData;

  return (
    <Card p="1.5rem" variant="outline">
      <CardHeader>
        <Heading size="lg">Spending Categories</Heading>
      </CardHeader>
      <CardBody>
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Show by Subcategory</FormLabel>
          <Switch onChange={() => setShowSubcategories((prev) => !prev)} />
        </FormControl>
        <Center width="100%" height="500px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart key={showSubcategories.toString()}>
              <Pie
                dataKey="value"
                isAnimationActive
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={130}
                outerRadius={150}
                paddingAngle={10}
                labelLine
                label={renderLabel}
                animationBegin={50}
                animationDuration={500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" formatter={renderLegendText} />
            </PieChart>
          </ResponsiveContainer>
        </Center>
      </CardBody>
    </Card>
  );
};

export default MonthlySpending;
