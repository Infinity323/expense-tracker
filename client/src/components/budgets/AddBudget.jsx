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
import { postBudget } from "../../services/BudgetService";

function AddBudget({ setReload }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [category, setCategory] = useState();
  const [subcategory, setSubcategory] = useState();
  const [amount, setAmount] = useState();

  const addBudget = async (event) => {
    event.preventDefault();
    await postBudget({ category, subcategory, amount });
    onClose();
  };

  const resetFields = () => {
    setCategory();
    setSubcategory();
    setAmount();
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
