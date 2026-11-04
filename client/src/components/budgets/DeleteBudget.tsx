import {
  Button,
  IconButton,
  CloseButton,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteBudget } from "../../services/budgetService";
import { ReactIcon } from "../ui/ReactIcon";

function DeleteBudget({ budgetDoc: budget, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  const removeBudget = async (event) => {
    event.preventDefault();
    await deleteBudget(budget.budgetId);
    onDelete();
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        aria-label="Delete budget"
      >
        <ReactIcon icon={FaRegTrashCan} />
      </IconButton>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(event) => setIsOpen(event.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Are you sure?</Dialog.Header>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Body>This action cannot be undone.</Dialog.Body>
              <Dialog.Footer>
                <Button colorPalette="red" onClick={removeBudget}>
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default DeleteBudget;
