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
} from "@chakra-ui/react";
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteTransaction } from "../../services/TransactionService";

function DeleteTransaction({ transactionDoc: transaction, onDelete }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const removeTransaction = async (event) => {
    event.preventDefault();
    await deleteTransaction(transaction._id, transaction._rev);
    onDelete();
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        onClick={onOpen}
        icon={<Icon as={FaRegTrashCan} />}
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
              onClick={(event) => {
                removeTransaction(event);
                onClose();
              }}
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
