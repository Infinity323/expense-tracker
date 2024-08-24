import { Box, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApiData } from "../../hooks/UseApiData";
import { getBudgets } from "../../services/BudgetService";
import { getSpendingOverTime } from "../../services/TrendsService";

function CategorySpendingOverTimeChart() {
  const [categories, setCategories] = useState([]);

  const [categoryData, categoryIsLoading, categoryError] = useApiData({
    apiCall: getBudgets(true),
  });
  const [spendingData, spendingIsLoading, spendingError] = useApiData({
    apiCall: getSpendingOverTime({ groupBy: "category", division: "monthly" }),
  });

  useEffect(() => {
    if (categoryData) {
      let categories = [];
      new Map(Object.entries(categoryData)).forEach((_, category) => {
        categories.push(category);
      });
      setCategories(categories);
    }
  }, [categoryData]);

  return (
    <ResponsiveContainer width="100%" height={500}>
      {categoryIsLoading || spendingIsLoading ? (
        <Skeleton />
      ) : (
        <LineChart
          data={spendingData}
          margin={{ top: 50, left: 50, right: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="number"
            domain={["auto", "auto"]}
            tick={<DateTick />}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value, _) => `$${value}`}
          />
          {spendingData &&
            categories &&
            categories.map((category) => (
              <>
                <Tooltip content={<CustomTooltip />} />
                <Line dataKey={category} />
              </>
            ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}

function DateTick({ x, y, stroke, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {dateToString(payload.value)}
      </text>
    </g>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" rounded="md" boxShadow="md" padding="1rem">
        <Text as="b">{payload[0].name}</Text>
        <Text>
          {dateToString(Number(label))}: ${payload[0].value}
        </Text>
      </Box>
    );
  }
}

const dateToString = (value) => {
  let date = new Date(value);
  return `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;
};

export default CategorySpendingOverTimeChart;
