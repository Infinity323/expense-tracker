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
import { putTransaction } from "../../services/TransactionService";
import BudgetsSelect from "../budgets/BudgetsSelect";

function EditTransaction({ transactionDoc }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [date, setDate] = useState(transactionDoc.date);
  const [name, setName] = useState(transactionDoc.name);
  const [description, setDescription] = useState(transactionDoc.description);
  const [category, setCategory] = useState(transactionDoc.category);
  const [subcategory, setSubcategory] = useState(transactionDoc.subcategory);
  const [amount, setAmount] = useState(transactionDoc.amount);

  const editTransaction = async (event) => {
    event.preventDefault();
    let _id = transactionDoc._id;
    let _rev = transactionDoc._rev;
    await putTransaction({
      _id,
      _rev,
      date,
      name,
      description,
      category,
      subcategory,
      amount,
    });
    onClose();
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        onClick={onOpen}
        icon={<Icon as={FaPencil} />}
      />
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
              onClick={editTransaction}
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

export default EditTransaction;
