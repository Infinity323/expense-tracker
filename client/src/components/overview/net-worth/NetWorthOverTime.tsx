import {
  Alert,
  AlertIcon,
  Box,
  Card,
  CardBody,
  CardHeader,
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
import { formatCurrency } from "../../../utils/CurrencyUtil";

function NetWorthOverTime() {
  const chartHeight = useBreakpointValue({ base: 280, md: 360 }) ?? 280;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["netWorthHistory"],
    queryFn: getNetWorthHistory,
  });

  return (
    <Card variant="outline">
      <CardHeader>
        <Heading as="h3" size="md">
          Net Worth Over Time
        </Heading>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <Skeleton height={`${chartHeight}px`} />
        ) : isError ? (
          <Alert status="error">
            <AlertIcon />
            Could not load net worth history. Please try again.
          </Alert>
        ) : !data?.length ? (
          <Text>No net worth history available yet.</Text>
        ) : (
          <>
            <Box width="100%" height={`${chartHeight}px`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 12, right: 24, bottom: 32, left: 8 }}
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
                    height={36}
                  />
                  <YAxis
                    width={92}
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
            {data.length === 1 && (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Daily history will build as you use the app.
              </Text>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}

export default NetWorthOverTime;
