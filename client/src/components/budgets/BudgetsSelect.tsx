import { Alert, NativeSelect } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getSortedBudgets } from "../../services/budgetService";

function BudgetsSelect({
  selectedCategory,
  selectedSubcategory,
  setCategory,
  setSubcategory,
}) {
  const { data: budgets, isError } = useQuery({
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
      {isError && (
        <Alert.Root status="error" size="sm">
          <Alert.Indicator />
          <Alert.Description>
            Could not load budget categories. Please try again.
          </Alert.Description>
        </Alert.Root>
      )}
      <NativeSelect.Root>
        <NativeSelect.Field
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
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <NativeSelect.Root disabled={!selectedCategory}>
        <NativeSelect.Field
          onChange={changeSubcategory}
          value={selectedSubcategory}
          placeholder="Subcategory"
        >
          {budgets?.[selectedCategory]?.map((subcategory) => (
            <option key={subcategory} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </>
  );
}

export default BudgetsSelect;
