import {
  Button,
  IconButton,
  CloseButton,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteTransaction } from "../../services/transactionService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useToast } from "../ui/Toaster";
import { ReactIcon } from "../ui/ReactIcon";

function DeleteTransaction({ transactionDoc: transaction, refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const removeTransaction = async () => {
    setIsDeleting(true);
    try {
      await deleteTransaction(transaction.transactionId);
      await queryClient.invalidateQueries(["transactionTags"]);
      await refetch();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Could not delete transaction",
        description: getErrorMessage(error, "Please try again."),
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        aria-label="Delete transaction"
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
                <Button
                  colorPalette="red"
                  onClick={removeTransaction}
                  loading={isDeleting}
                >
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

export default DeleteTransaction;
