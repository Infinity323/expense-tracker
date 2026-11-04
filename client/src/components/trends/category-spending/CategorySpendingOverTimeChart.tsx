import {
  Box,
  Button,
  Card,
  Alert,
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
import { useTimeSeriesNavigation } from "../../../hooks/useTimeSeriesNavigation";
import { COLOR_MAP } from "../../../utils/ColorUtil";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import { dateToMMMYYYY, dateToString } from "../../../utils/DateUtil";

const CategorySpendingOverTimeChart = () => {
  const chartHeight =
    useBreakpointValue({ base: 480, lg: 650 }) ?? 480;
  const isMobile = chartHeight === 480;
  const {
    data: categoryData,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
  } = useQuery({
    queryKey: ["sortedBudgets"],
    queryFn: getSortedBudgets,
  });
  const {
    data: spendingData,
    isLoading: spendingIsLoading,
    isError: spendingIsError,
  } = useQuery({
    queryKey: ["spendingOverTime", { groupBy: "category", division: "monthly" }],
    queryFn: getSpendingOverTime,
  });
  const [hover, setHover] = useState<string>();
  const { visibleData, reset, isZoomed, chartRef, interactionProps } =
    useTimeSeriesNavigation(spendingData ?? []);

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

  if (categoryIsError || spendingIsError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Description>
          Could not load monthly expenses by category. Please try again.
        </Alert.Description>
      </Alert.Root>
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
    <Stack gap={4}>
      <Flex align="center" justify="space-between" mb={-2}>
        <Text fontSize="sm" color="gray.500">
          Scroll to zoom, drag to pan, double-click to reset
        </Text>
        {isZoomed && (
          <Button size="xs" variant="ghost" onClick={reset}>
            Reset
          </Button>
        )}
      </Flex>
      <Box
        width="100%"
        height={chartHeight}
        ref={chartRef}
        aria-label="Category spending chart. Scroll to zoom, drag to pan, double-click to reset."
        {...interactionProps}
        css={{
          "& touchAction": "pan-y",
          "& userSelect": "none",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={visibleData}
            margin={{
              top: 24,
              left: 8,
              right: 24,
              bottom: isMobile ? 40 : 24,
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
      <Wrap justify="center" columnGap={4} rowGap={2}>
        {legendPayload.map(({ value, color }) => {
          const category = String(value);
          return (
            <WrapItem key={category}>
              <Box
                display="inline-flex"
                alignItems="center"
                gap={2}
                color="inherit"
                opacity={hover && hover !== category ? 0.45 : 1}
                asChild
              >
                <button
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
                </button>
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
      <Card.Root>
        <Card.Body>
          <Text asChild>
            <b>{dateToString(Number(label))}</b>
          </Text>
          <Stack gap={0}>
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
        </Card.Body>
      </Card.Root>
    );
  }
}

export default CategorySpendingOverTimeChart;
