import {
  Button,
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
import { putBudget } from "../../services/budgetService";
import BudgetsSelect from "./BudgetsSelect";

function AddBudget({ setReload }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [category, setCategory] = useState<string>();
  const [subcategory, setSubcategory] = useState<string>();
  const [amount, setAmount] = useState<string>();

  const addBudget = async (event) => {
    event.preventDefault();
    // TODO: get _id _rev in context
    await putBudget({ category, subcategory, amount });
    onClose();
    setReload(true);
  };

  const resetFields = () => {
    setCategory(undefined);
    setSubcategory(undefined);
    setAmount(undefined);
    setReload(true);
  };

  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        Add Budget
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Budget</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <BudgetsSelect
                selectedCategory={category}
                selectedSubcategory={subcategory}
                setCategory={setCategory}
                setSubcategory={setSubcategory}
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
              onClick={(event) => {
                addBudget(event);
                resetFields();
              }}
              isDisabled={!category || !subcategory || !amount}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddBudget;
