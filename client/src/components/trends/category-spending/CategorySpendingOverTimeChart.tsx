import {
  Box,
  Card,
  CardBody,
  Flex,
  Skeleton,
  Spacer,
  Stack,
  Text,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { getSortedBudgets } from "../../../services/budgetService";
import { getSpendingOverTime } from "../../../services/trendsService";
import { COLOR_MAP } from "../../../utils/ColorUtil";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import { dateToMMMYYYY, dateToString } from "../../../utils/DateUtil";

const CategorySpendingOverTimeChart = () => {
  const chartHeight = useBreakpointValue({ base: 480, lg: 650 }) ?? 480;
  const isMobile = chartHeight === 480;
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
  const [hover, setHover] = useState<string>();

  const categories = categoryData
    ? Object.entries(categoryData).map((entry) => entry[0])
    : undefined;

  const legendPayload: Payload[] = useMemo(
    () =>
      categories
        ?.filter((category) =>
          spendingData?.some(
            (d) => typeof d[category] === "number" && d[category] !== 0,
          ),
        )
        .map((category) => ({
          value: category,
          color: COLOR_MAP[category],
          type: "square",
        })),
    [categories, spendingData],
  );

  if (categoryIsLoading || spendingIsLoading) {
    return (
      <Box>
        <Skeleton height={300} />
      </Box>
    );
  }

  if (!categoryData?.length && !spendingData?.length) {
    return (
      <Box p="1.5rem">
        <Text>No data available.</Text>
      </Box>
    );
  }
  return (
    <Stack spacing={4}>
      <Box width="100%" height={chartHeight}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={spendingData}
            margin={{
              top: 24,
              left: 8,
              right: 24,
              bottom: isMobile ? 48 : 32,
            }}
            stackOffset="sign"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={dateToMMMYYYY}
              interval="preserveStartEnd"
              angle={isMobile ? -35 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 58 : 30}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(value, _) => formatCurrency(value)}
              width={88}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "black", opacity: 0.2 }}
            />
            {spendingData &&
              categories?.map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId={0}
                  fill={COLOR_MAP[category]}
                  barSize={100}
                  fillOpacity={Number(hover === category || !hover ? 1 : 0.2)}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Wrap justify="center" spacingX={4} spacingY={2}>
        {legendPayload.map(({ value, color }) => {
          const category = String(value);
          return (
            <WrapItem key={category}>
              <Box
                as="button"
                display="inline-flex"
                alignItems="center"
                gap={2}
                color="inherit"
                opacity={hover && hover !== category ? 0.45 : 1}
                onMouseEnter={() => setHover(category)}
                onMouseLeave={() => setHover(undefined)}
                onFocus={() => setHover(category)}
                onBlur={() => setHover(undefined)}
              >
                <Box
                  aria-hidden="true"
                  width="10px"
                  height="10px"
                  flexShrink={0}
                  borderRadius="sm"
                  backgroundColor={color}
                />
                <Text fontSize="sm">{category}</Text>
              </Box>
            </WrapItem>
          );
        })}
      </Wrap>
    </Stack>
  );
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <Card>
        <CardBody>
          <Text as="b">{dateToString(Number(label))}</Text>
          <Stack spacing={0}>
            {payload
              .sort((a, b) => b.value - a.value)
              .map((data) => (
                <Flex color={COLOR_MAP[data.name]}>
                  <Text>{data.name}</Text>
                  <Spacer marginLeft={2} marginRight={2} />
                  <Text>{formatCurrency(data.value)}</Text>
                </Flex>
              ))}
          </Stack>
        </CardBody>
      </Card>
    );
  }
}

export default CategorySpendingOverTimeChart;
