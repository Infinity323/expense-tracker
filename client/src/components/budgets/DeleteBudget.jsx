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
import { deleteBudget } from "../../services/BudgetService";

function DeleteBudget({ budgetDoc: budget, onDelete }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const removeBudget = async (event) => {
    event.preventDefault();
    await deleteBudget(budget._id, budget._rev);
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
            <Button colorScheme="red" onClick={removeBudget}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteBudget;
