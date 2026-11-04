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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { postTransaction } from "../../services/transactionService";
import BudgetsSelect from "../budgets/BudgetsSelect";
import { getErrorMessage } from "../../utils/getErrorMessage";
import TagsInput from "./TagsInput";

function AddTransaction({ setReload }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const [date, setDate] = useState<string>();
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [subcategory, setSubcategory] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>();

  const addTransaction = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await postTransaction({
        date,
        name,
        description,
        category,
        subcategory,
        tags,
        amount: Number(amount),
      });
      await queryClient.invalidateQueries(["transactionTags"]);
      setDate(undefined);
      setName(undefined);
      setDescription(undefined);
      setCategory(undefined);
      setSubcategory(undefined);
      setTags([]);
      setAmount(undefined);
      onClose();
      setReload(true);
    } catch (error) {
      toast({
        title: "Could not add transaction",
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
              <TagsInput tags={tags} setTags={setTags} />
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
              onClick={addTransaction}
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
}

export default AddTransaction;
