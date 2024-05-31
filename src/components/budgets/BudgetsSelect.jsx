import { Select } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { DbContext } from "../../DbContext";

function BudgetsSelect() {
  const db = useContext(DbContext);

  const [categories, setCategories] = useState();
  const [subcategories, setSubcategories] = useState();

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
    setCategories([...new Set(result.docs.map((budget) => budget.category))]);
    setSubcategories([
      ...new Set(result.docs.map((budget) => budget.subcategory)),
    ]);
  };

  useEffect(() => {
    loadBudgets();
  });

  return (
    <>
      <Select placeholder="Category">
        {categories
          ? categories.map((category) => (
              <option value={category}>{category}</option>
            ))
          : ""}
      </Select>
      <Select placeholder="Subcategory">
        {subcategories
          ? subcategories.map((subcategory) => (
              <option value={subcategory}>{subcategory}</option>
            ))
          : ""}
      </Select>
    </>
  );
}

export default BudgetsSelect;
