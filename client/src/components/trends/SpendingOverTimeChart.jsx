import { Box, Text } from "@chakra-ui/react";
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
import { getBudgets } from "../../services/BudgetService";
import { getSpendingOverTime } from "../../services/TrendsService";

function SpendingOverTimeChart({ setIsLoading }) {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);

  const getData = async () => {
    let categoryResults = await getBudgets(true);
    let categories = [];
    new Map(Object.entries(categoryResults)).forEach((_, category) => {
      categories.push(category);
    });
    setCategories(categories);

    let spendingResults = await getSpendingOverTime({
      groupBy: "category",
      division: "monthly",
    });
    setData(spendingResults);

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={data}
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
        {data &&
          categories &&
          categories.map((category) => (
            <>
              <Tooltip content={<CustomTooltip />} />
              <Line dataKey={category} />
            </>
          ))}
      </LineChart>
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

export default SpendingOverTimeChart;
