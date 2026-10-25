import { TransactionDoc } from "@backend/db/types/transactionDoc";
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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { putTransaction } from "../../services/transactionService";
import BudgetsSelect from "../budgets/BudgetsSelect";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface EditTransactionProps {
  transactionDoc: TransactionDoc;
  refetch: () => void;
}

const EditTransaction = (props: EditTransactionProps) => {
  const { transactionDoc, refetch } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const [date, setDate] = useState(transactionDoc.date);
  const [name, setName] = useState(transactionDoc.name);
  const [description, setDescription] = useState(transactionDoc.description);
  const [category, setCategory] = useState(transactionDoc.category);
  const [subcategory, setSubcategory] = useState(transactionDoc.subcategory);
  const [amount, setAmount] = useState(transactionDoc.amount.toString());

  const editTransaction = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await putTransaction({
        transactionId: transactionDoc.transactionId,
        date,
        name,
        description,
        category,
        subcategory,
        amount: parseFloat(amount),
      });
      await refetch();
      onClose();
    } catch (error) {
      toast({
        title: "Could not update transaction",
        description: getErrorMessage(error, "Please check your details and try again."),
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
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
              isLoading={isSubmitting}
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
