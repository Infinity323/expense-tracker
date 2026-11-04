import { BudgetDoc } from "@backend/db/types/budgetDoc";
import {
  Button,
  CloseButton,
  Dialog,
  IconButton,
  Input,
  InputGroup,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { putBudget } from "../../services/budgetService";
import { ReactIcon } from "../ui/ReactIcon";

interface EditBudgetProps {
  budgetDoc: BudgetDoc;
  refetch: () => void;
}

const EditBudget = ({ budgetDoc, refetch }: EditBudgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState(budgetDoc.category);
  const [subcategory, setSubcategory] = useState(budgetDoc.subcategory);
  const [amount, setAmount] = useState(budgetDoc.amount.toString());

  const editBudget = async (event) => {
    event.preventDefault();
    await putBudget({
      budgetId: budgetDoc.budgetId,
      category,
      subcategory,
      amount: parseFloat(amount),
    });
    setIsOpen(false);
    refetch();
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        aria-label="Edit budget"
      >
        <ReactIcon icon={FaPencil} />
      </IconButton>
      <Dialog.Root open={isOpen} onOpenChange={(event) => setIsOpen(event.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Edit Budget</Dialog.Header>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Body>
                <Stack>
                  <Input
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Category"
                    aria-invalid={category === ""}
                  />
                  <Input
                    value={subcategory}
                    onChange={(event) => setSubcategory(event.target.value)}
                    placeholder="Subcategory"
                    aria-invalid={subcategory === ""}
                  />
                  <InputGroup startElement="$">
                    <Input
                      value={amount}
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
                  onClick={editBudget}
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
};

export default EditBudget;
