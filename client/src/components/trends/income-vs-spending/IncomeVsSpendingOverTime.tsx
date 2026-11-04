import {
  Box,
  Card,
  CardBody,
  Button,
  Flex,
  Skeleton,
  Spacer,
  Text,
  useBreakpointValue,
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
import { useTimeSeriesNavigation } from "../../../hooks/useTimeSeriesNavigation";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import { dateToMMMYYYY, dateToString } from "../../../utils/DateUtil";

function IncomeVsSpendingOverTime() {
  const chartHeight = useBreakpointValue({ base: 360, md: 500 }) ?? 360;
  const { data, isLoading } = useQuery({
    queryKey: ["incomeVsExpenses"],
    queryFn: getIncomeVsExpenses,
  });
  const { visibleData, reset, isZoomed, chartRef, interactionProps } =
    useTimeSeriesNavigation(data ?? []);

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
    <Box>
      <Flex align="center" justify="space-between" mb={2}>
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
        aria-label="Income and expenses chart. Scroll to zoom, drag to pan, double-click to reset."
        {...interactionProps}
        sx={{ touchAction: "pan-y", userSelect: "none" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={visibleData}
            margin={{
              top: 30,
              left: 8,
              right: 24,
              bottom: chartHeight === 360 ? 40 : 24,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={dateToMMMYYYY}
              interval="preserveStartEnd"
              angle={chartHeight === 360 ? -35 : 0}
              textAnchor={chartHeight === 360 ? "end" : "middle"}
              height={chartHeight === 360 ? 58 : 30}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(value, _) => formatCurrency(value)}
              width={88}
              tick={{ fontSize: 11 }}
            />
            <Legend height={36} wrapperStyle={{ paddingTop: 8 }} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "black", opacity: 0.2 }}
            />
            <Bar dataKey="Income" stroke="green" fill="green" />
            <Bar dataKey="Expenses" stroke="red" fill="red" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
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
