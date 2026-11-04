import {
  Button,
  CloseButton,
  Dialog,
  Input,
  InputGroup,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { showToast } from "../ui/Toaster";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { postTransaction } from "../../services/transactionService";
import BudgetsSelect from "../budgets/BudgetsSelect";
import TagsInput from "./TagsInput";

function AddTransaction({ setReload }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsOpen(false);
      setReload(true);
    } catch (error) {
      showToast({
        title: "Could not add transaction",
        description: getErrorMessage(
          error,
          "Please check your details and try again.",
        ),
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button colorPalette="teal" onClick={() => setIsOpen(true)}>
        Add Transaction
      </Button>
      <Dialog.Root open={isOpen} onOpenChange={(event) => setIsOpen(event.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Add New Transaction</Dialog.Header>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Body>
                <Stack>
                  <Input
                    value={date ?? ""}
                    onChange={(event) => setDate(event.target.value)}
                    placeholder="Date"
                    type="date"
                  />
                  <Input
                    value={name ?? ""}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Name"
                    aria-invalid={name === ""}
                  />
                  <Input
                    value={description ?? ""}
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
                  <InputGroup startElement="$">
                    <Input
                      value={amount ?? ""}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="Amount"
                      aria-invalid={amount === ""}
                    />
                  </InputGroup>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  colorPalette="teal"
                  onClick={addTransaction}
                  loading={isSubmitting}
                  disabled={
                    !date || !name || !category || !subcategory || !amount
                  }
                >
                  Submit
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default AddTransaction;
