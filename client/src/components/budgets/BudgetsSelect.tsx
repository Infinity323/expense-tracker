import { Select } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getSortedBudgets } from "../../services/budgetService";

function BudgetsSelect({
  selectedCategory,
  selectedSubcategory,
  setCategory,
  setSubcategory,
}) {
  const { data: budgets } = useQuery({
    queryKey: ["sortedBudgets"],
    queryFn: getSortedBudgets,
  });

  const changeCategory = (event) => {
    setCategory(event.target.value);
  };

  const changeSubcategory = (event) => {
    setSubcategory(event.target.value);
  };

  return (
    <>
      <Select
        onChange={changeCategory}
        value={selectedCategory}
        placeholder="Category"
      >
        {budgets &&
          Object.keys(budgets).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
      </Select>
      <Select
        onChange={changeSubcategory}
        value={selectedSubcategory}
        placeholder="Subcategory"
        isDisabled={!selectedCategory}
      >
        {budgets?.[selectedCategory]?.map((subcategory) => (
          <option key={subcategory} value={subcategory}>
            {subcategory}
          </option>
        ))}
      </Select>
    </>
  );
}

export default BudgetsSelect;
