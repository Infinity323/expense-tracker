import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useQuery } from "react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getNetWorthHistory } from "../../../services/trendsService";
import { useTimeSeriesNavigation } from "../../../hooks/useTimeSeriesNavigation";
import { formatCurrency } from "../../../utils/CurrencyUtil";

function NetWorthOverTime() {
  const chartHeight =
    useBreakpointValue({ base: 340, md: 420 }) ?? 340;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["netWorthHistory"],
    queryFn: getNetWorthHistory,
  });
  const { visibleData, reset, isZoomed, chartRef, interactionProps } =
    useTimeSeriesNavigation(data ?? []);

  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        Net Worth Over Time
      </Heading>
      {isLoading ? (
        <Skeleton height={`${chartHeight}px`} />
      ) : isError ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          Could not load net worth history. Please try again.
        </Alert.Root>
      ) : !data?.length ? (
        <Text>No net worth history available yet.</Text>
      ) : (
        <>
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
            height={`${chartHeight}px`}
            ref={chartRef}
            aria-label="Net worth chart. Scroll to zoom, drag to pan, double-click to reset."
            {...interactionProps}
            css={{
              "& touchAction": "pan-y",
              "& userSelect": "none",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visibleData}
                margin={{
                  top: 12,
                  right: 16,
                  bottom: 12,
                  left: 12,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    format(new Date(`${date}T00:00:00`), "MMM d")
                  }
                  minTickGap={24}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 11 }}
                  padding={{ left: 12, right: 12 }}
                  height={40}
                />
                <YAxis
                  width={120}
                  tickMargin={8}
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  labelFormatter={(date) =>
                    format(new Date(`${date}T00:00:00`), "MMMM d, yyyy")
                  }
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Line
                  type="monotone"
                  dataKey="netWorth"
                  name="Net Worth"
                  stroke="#319795"
                  strokeWidth={2}
                  dot={data.length === 1}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}
    </Box>
  );
}

export default NetWorthOverTime;
