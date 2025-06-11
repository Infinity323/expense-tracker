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
import { postTransaction } from "../../services/transactionService";
import BudgetsSelect from "../budgets/BudgetsSelect";

function AddTransaction({ setReload }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [date, setDate] = useState<string>();
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [subcategory, setSubcategory] = useState<string>();
  const [amount, setAmount] = useState<string>();

  const addTransaction = async (event) => {
    event.preventDefault();
    await postTransaction({
      date,
      name,
      description,
      category,
      subcategory,
      amount,
    });
    onClose();
  };

  const resetFields = () => {
    setDate(undefined);
    setName(undefined);
    setDescription(undefined);
    setCategory(undefined);
    setSubcategory(undefined);
    setAmount(undefined);
    setReload(true);
  };

  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        Add Transaction
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Input
                value={date}
                onChange={(event) => setDate(event.target.value)}
                placeholder="Date"
                type="date"
              />
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                isInvalid={name === ""}
              />
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
              />
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
                  placeholder="Amount"
                  isInvalid={amount === ""}
                ></Input>
              </InputGroup>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={(event) => {
                addTransaction(event);
                resetFields();
              }}
              isDisabled={
                !date || !name || !category || !subcategory || !amount
              }
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddTransaction;
