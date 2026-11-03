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
  Box,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getCurrentMonthSpending } from "../../../services/trendsService";
import { COLOR_MAP } from "../../../utils/ColorUtil";
import { formatCurrency } from "../../../utils/CurrencyUtil";

interface MonthlySpendingProps {}

const MonthlySpending = (props: MonthlySpendingProps) => {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["currentMonthSpending"],
    queryFn: getCurrentMonthSpending,
  });
  const [showSubcategories, setShowSubcategories] = useState<boolean>(false);
  const chartHeight = useBreakpointValue({ base: 360, md: 500 }) ?? 360;
  const outerRadius = useBreakpointValue({ base: 90, md: 150 }) ?? 90;
  const innerRadius = useBreakpointValue({ base: 65, md: 130 }) ?? 65;

  const categoryData = useMemo(
    () =>
      expenses
        ? Object.entries(
            expenses?.reduce(
              (acc, expense) => {
                acc[expense.category] = acc[expense.category] || 0;
                acc[expense.category] += expense.amount;
                return acc;
              },
              {} as Record<string, number>,
            ),
          )
            .map(([name, value]) => ({ name, value }))
            .filter((entry) => entry.value > 0)
        : undefined,
    [expenses],
  );

  const subcategoryData = useMemo(
    () =>
      expenses
        ? Object.entries(
            expenses?.reduce(
              (acc, expense) => {
                const key = `${expense.category}|${expense.subcategory}`;
                acc[key] = acc[key] || 0;
                acc[key] += expense.amount;
                return acc;
              },
              {} as Record<string, number>,
            ),
          )
            .map(([name, value]) => ({ name, value }))
            .filter((entry) => entry.value > 0)
        : undefined,
    [expenses],
  );

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
        <Box width="100%">
          <Center width="100%" height={`${chartHeight}px`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart key={showSubcategories.toString()}>
                <Pie
                  dataKey="value"
                  isAnimationActive
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  paddingAngle={10}
                  animationBegin={50}
                  animationDuration={500}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={renderLegendText}
                />
              </PieChart>
            </ResponsiveContainer>
          </Center>
          <Wrap justify="center" spacingX={4} spacingY={2} mt={2}>
            {data.map((entry) => (
              <WrapItem key={entry.name}>
                <Box display="inline-flex" alignItems="center" gap={2}>
                  <Box
                    aria-hidden="true"
                    width="10px"
                    height="10px"
                    flexShrink={0}
                    borderRadius="sm"
                    backgroundColor={COLOR_MAP[entry.name]}
                  />
                  <Text fontSize="sm">{renderLegendText(entry.name)}</Text>
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </CardBody>
    </Card>
  );
};

export default MonthlySpending;
