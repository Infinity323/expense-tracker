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
import { usePouch } from "use-pouchdb";

function AddTransaction() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const db = usePouch();

  const [date, setDate] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState();
  const [subcategory, setSubcategory] = useState();
  const [amount, setAmount] = useState();

  const handleAddTransaction = async (event) => {
    event.preventDefault();
    const transactionDoc = {
      _id: crypto.randomUUID(),
      type: "transaction",
      date: date,
      name: name,
      description: description,
      category: category,
      subcategory: subcategory,
      amount: parseFloat(amount),
    };
    await db.put(transactionDoc);
    console.log(
      "Successfully added new transaction document: %s",
      JSON.stringify(transactionDoc)
    );
    onClose();
    setDate();
    setName();
    setDescription();
    setCategory();
    setSubcategory();
    setAmount();
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
                  placeholder="Amount"
                  isInvalid={amount === ""}
                ></Input>
              </InputGroup>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleAddTransaction}
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
