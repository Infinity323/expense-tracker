import { Box, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApiData } from "../../hooks/useApiData";
import { getBudgets } from "../../services/budgetService";
import { getSpendingOverTime } from "../../services/trendsService";
import { dateToString } from "../../utils/DateUtil";

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
        <AreaChart
          data={spendingData}
          margin={{ top: 50, left: 50, right: 50, bottom: 50 }}
        >
          <defs>
            {categories.map((category) => (
              <linearGradient
                id={`color${category.replace(" ", "")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={COLOR_MAP[category]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={COLOR_MAP[category]}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
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
                <Area
                  dataKey={category}
                  // dot={false}
                  stroke={COLOR_MAP[category]}
                  strokeWidth={2}
                  fill={`url(#color${category.replace(" ", "")})`}
                />
              </>
            ))}
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" rounded="md" boxShadow="md" padding="1rem">
        <Text as="b">{dateToString(Number(label))}</Text>
        {payload
          .sort((a, b) => b.value - a.value)
          .map((data) => (
            <Text color={COLOR_MAP[data.name]}>
              {data.name}: ${data.value}
            </Text>
          ))}
      </Box>
    );
  }
}

export default CategorySpendingOverTimeChart;
