import { BudgetDoc } from "@backend/db/types/budgetDoc";
import {
  Button,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { putBudget } from "../../services/budgetService";

interface EditBudgetProps {
  budgetDoc: BudgetDoc;
  refetch: () => void;
}

const EditBudget = (props: EditBudgetProps) => {
  const { budgetDoc, refetch } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    onClose();
    refetch();
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        onClick={onOpen}
        icon={<Icon as={FaPencil} />}
        aria-label=""
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Budget</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Category"
                isInvalid={category === ""}
              />
              <Input
                value={subcategory}
                onChange={(event) => setSubcategory(event.target.value)}
                placeholder="Subcategory"
                isInvalid={subcategory === ""}
              />
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  $
                </InputLeftElement>
                <Input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Monthly Amount"
                  isInvalid={amount === ""}
                ></Input>
              </InputGroup>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={editBudget}
              isDisabled={!category || !subcategory || !amount}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBudget;
