import { Select } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { DbContext } from "../../DbContext";

function BudgetsSelect({
  selectedCategory,
  selectedSubcategory,
  setCategory,
  setSubcategory,
}) {
  const db = useContext(DbContext);

  const [budgets, setBudgets] = useState();

  const loadBudgets = async () => {
    await db.createIndex({
      index: { fields: ["type"] },
    });
    await db.createIndex({
      index: { fields: ["category"] },
    });
    await db.createIndex({
      index: { fields: ["subcategory"] },
    });
    let result = await db.find({
      selector: {
        type: "budget",
        category: { $exists: true },
        subcategory: { $exists: true },
      },
      sort: [{ category: "asc", subcategory: "asc" }],
    });
    let budgetsMap = {};
    result.docs.forEach((doc) => {
      budgetsMap[doc.category] = budgetsMap[doc.category] || [];
      budgetsMap[doc.category].push(doc.subcategory);
    });
    setBudgets(budgetsMap);
  };

  const changeCategory = (event) => {
    setCategory(event.target.value);
  };

  const changeSubcategory = (event) => {
    setSubcategory(event.target.value);
  };

  useEffect(() => {
    loadBudgets();
  });

  return (
    <>
      <Select
        onChange={changeCategory}
        value={selectedCategory}
        placeholder="Category"
      >
        {budgets
          ? Object.keys(budgets).map((category) => (
              <option value={category}>{category}</option>
            ))
          : ""}
      </Select>
      <Select
        onChange={changeSubcategory}
        value={selectedSubcategory}
        placeholder="Subcategory"
        isDisabled={!selectedCategory}
      >
        {budgets && budgets[selectedCategory]
          ? budgets[selectedCategory].map((subcategory) => (
              <option value={subcategory}>{subcategory}</option>
            ))
          : ""}
      </Select>
    </>
  );
}

export default BudgetsSelect;
