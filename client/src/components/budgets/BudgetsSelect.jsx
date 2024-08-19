import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getBudgets } from "../../services/BudgetService";

function BudgetsSelect({
  selectedCategory,
  selectedSubcategory,
  setCategory,
  setSubcategory,
}) {
  const [budgets, setBudgets] = useState();

  const loadBudgets = async () => {
    let budgets = await getBudgets(true);
    setBudgets(budgets);
  };

  const changeCategory = (event) => {
    setCategory(event.target.value);
  };

  const changeSubcategory = (event) => {
    setSubcategory(event.target.value);
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  return (
    <>
      <Select
        onChange={changeCategory}
        value={selectedCategory}
        placeholder="Category"
      >
        {budgets &&
          Object.keys(budgets).map((category) => (
            <option value={category}>{category}</option>
          ))}
      </Select>
      <Select
        onChange={changeSubcategory}
        value={selectedSubcategory}
        placeholder="Subcategory"
        isDisabled={!selectedCategory}
      >
        {budgets &&
          budgets[selectedCategory] &&
          budgets[selectedCategory].map((subcategory) => (
            <option value={subcategory}>{subcategory}</option>
          ))}
      </Select>
    </>
  );
}

export default BudgetsSelect;
