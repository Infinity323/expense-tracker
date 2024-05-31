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
import { useContext } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { DbContext } from "../../DbContext";

function DeleteBudget({ budgetDoc, onDelete }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const db = useContext(DbContext);

  const deleteBudget = async (event) => {
    event.preventDefault();
    await db.remove(budgetDoc);
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
            <Button colorScheme="red" onClick={deleteBudget}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteBudget;
