import {
  Button,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteTransaction } from "../../services/transactionService";
import { getErrorMessage } from "../../utils/getErrorMessage";

function DeleteTransaction({ transactionDoc: transaction, refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const removeTransaction = async () => {
    setIsDeleting(true);
    try {
      await deleteTransaction(transaction.transactionId);
      await refetch();
      onClose();
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
        onClick={onOpen}
        icon={<Icon as={FaRegTrashCan} />}
        aria-label=""
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>This action cannot be undone.</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={removeTransaction}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteTransaction;
