import {
  Button,
  CloseButton,
  Dialog,
  Input,
  InputGroup,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useBudgets } from "../../hooks/useBudgets";
import { putBudget } from "../../services/budgetService";
import BudgetsSelect from "./BudgetsSelect";

function AddBudget({ setReload }) {
  const { budgets } = useBudgets();
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<string>();
  const [subcategory, setSubcategory] = useState<string>();
  const [amount, setAmount] = useState<string>();

  const resetFields = () => {
    setCategory(undefined);
    setSubcategory(undefined);
    setAmount(undefined);
  };

  const addBudget = async (event) => {
    event.preventDefault();
    const budget = budgets.find(
      (item) =>
        item.category === category && item.subcategory === subcategory,
    );
    if (!budget) return;

    await putBudget({ budgetId: budget.budgetId, category, subcategory, amount });
    setIsOpen(false);
    resetFields();
    setReload(true);
  };

  return (
    <>
      <Button colorPalette="teal" onClick={() => setIsOpen(true)}>
        Add Budget
      </Button>
      <Dialog.Root open={isOpen} onOpenChange={(event) => setIsOpen(event.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Add New Budget</Dialog.Header>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Body>
                <Stack>
                  <BudgetsSelect
                    selectedCategory={category}
                    selectedSubcategory={subcategory}
                    setCategory={setCategory}
                    setSubcategory={setSubcategory}
                  />
                  <InputGroup startElement="$">
                    <Input
                      value={amount ?? ""}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="Monthly Amount"
                      aria-invalid={amount === ""}
                    />
                  </InputGroup>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  colorPalette="teal"
                  onClick={addBudget}
                  disabled={!category || !subcategory || !amount}
                >
                  Submit
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default AddBudget;
