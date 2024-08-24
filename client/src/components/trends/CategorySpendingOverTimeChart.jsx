import { Box, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
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
import { dateToString } from "../shared/LineChartShared";

const COLOR_MAP = {
  "Bank Fees": "#EAC435",
  Entertainment: "#345995",
  "Food and Drink": "#E40066",
  "General Merchandise": "#03CEA4",
  "General Services": "#FB4D3D",
  "Government and Non-Profit": "#044389",
  "Home Improvement": "#536271",
  "Loan Payments": "#FFAD05",
  Medical: "#7CAFC4",
  "Personal Care": "#5995ED",
  "Rent and Utilities": "#617073",
  "Transfer In": "#7A93AC",
  "Transfer Out": "#92BCEA",
  Transportation: "#AFB3F7",
  Travel: "#84828F",
};

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
        // don't display income
        if (category === "Income") {
          return;
        }
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
            tickFormatter={dateToString}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value, _) => `$${value}`}
          />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
          {spendingData &&
            categories &&
            categories.map((category) => (
              <>
                <Line
                  dataKey={category}
                  dot={false}
                  stroke={COLOR_MAP[category]}
                  strokeWidth={2}
                />
              </>
            ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" rounded="md" boxShadow="md" padding="1rem">
        <Text as="b">{dateToString(Number(label))}</Text>
        {payload
          .sort((a, b) => b.value - a.value)
          .map((data) => (
            <Text>
              {data.name}: ${data.value}
            </Text>
          ))}
      </Box>
    );
  }
}

export default CategorySpendingOverTimeChart;
