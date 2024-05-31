import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { DbContext } from "../../DbContext";

function AddBudget() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const db = useContext(DbContext);

  const [category, setCategory] = useState();
  const [subcategory, setSubcategory] = useState();
  const [amount, setAmount] = useState();

  const addBudget = async (event) => {
    event.preventDefault();
    const budgetDoc = {
      _id: crypto.randomUUID(),
      type: "budget",
      category: category,
      subcategory: subcategory,
      amount: parseFloat(amount),
    };
    await db.put(budgetDoc);
    console.log(
      "Successfully added new budget document: %s",
      JSON.stringify(budgetDoc)
    );
    onClose();
  };

  const resetFields = () => {
    setCategory();
    setSubcategory();
    setAmount();
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
