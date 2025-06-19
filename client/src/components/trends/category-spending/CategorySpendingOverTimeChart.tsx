import {
  Card,
  CardBody,
  Flex,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
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
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { getSortedBudgets } from "../../../services/budgetService";
import { getSpendingOverTime } from "../../../services/trendsService";
import { COLOR_MAP } from "../../../utils/ColorUtil";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import { dateToMMMYYYY, dateToString } from "../../../utils/DateUtil";

const CategorySpendingOverTimeChart: React.FC = () => {
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
            (d) => typeof d[category] === "number" && d[category] !== 0
          )
        )
        .map((category) => ({
          value: category,
          color: COLOR_MAP[category],
          type: "square",
        })),
    [categories, spendingData]
  );

  const handleLegendMouseEnter = (e: Payload) => {
    setHover(e.value);
  };

  const handleLegendMouseLeave = (e: Payload) => {
    setHover(undefined);
  };

  return (
    <ResponsiveContainer width="100%" height={800}>
      {categoryIsLoading || spendingIsLoading ? (
        <Skeleton />
      ) : (
        <BarChart
          data={spendingData}
          margin={{ top: 50, left: 50, right: 50, bottom: 50 }}
          stackOffset="sign"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={dateToMMMYYYY} />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value, _) => formatCurrency(value)}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "black", opacity: 0.2 }}
          />
          <Legend
            onMouseOver={handleLegendMouseEnter}
            onMouseOut={handleLegendMouseLeave}
            payload={legendPayload}
          />
          {spendingData &&
            categories?.map((category) => (
              <Bar
                dataKey={category}
                stackId={0}
                fill={COLOR_MAP[category]}
                barSize={100}
                fillOpacity={Number(hover === category || !hover ? 1 : 0.2)}
              />
            ))}
        </BarChart>
      )}
    </ResponsiveContainer>
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
