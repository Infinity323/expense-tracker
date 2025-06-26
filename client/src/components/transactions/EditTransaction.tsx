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
import React, { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { putTransaction } from "../../services/transactionService";
import BudgetsSelect from "../budgets/BudgetsSelect";
import { TransactionDoc } from "@backend/db/types/transactionDoc";

interface EditTransactionProps {
  transactionDoc: TransactionDoc;
  refetch: () => void;
}

const EditTransaction: React.FC<EditTransactionProps> = (props) => {
  const { transactionDoc, refetch } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [date, setDate] = useState(transactionDoc.date);
  const [name, setName] = useState(transactionDoc.name);
  const [description, setDescription] = useState(transactionDoc.description);
  const [category, setCategory] = useState(transactionDoc.category);
  const [subcategory, setSubcategory] = useState(transactionDoc.subcategory);
  const [amount, setAmount] = useState(transactionDoc.amount.toString());

  const editTransaction = async (event) => {
    event.preventDefault();
    await putTransaction({
      transactionId: transactionDoc.transactionId,
      date,
      name,
      description,
      category,
      subcategory,
      amount: parseFloat(amount),
    });
    refetch();
    onClose();
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
};

export default EditTransaction;
