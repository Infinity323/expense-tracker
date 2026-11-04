import { TransactionDoc } from "@backend/db/types/transactionDoc";
import {
  Alert,
  Button,
  CloseButton,
  Dialog,
  IconButton,
  Input,
  InputGroup,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { FaPencil } from "react-icons/fa6";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { putTransaction } from "../../services/transactionService";
import { showToast } from "../ui/Toaster";
import BudgetsSelect from "../budgets/BudgetsSelect";
import TagsInput from "./TagsInput";
import { ReactIcon } from "../ui/ReactIcon";

interface EditTransactionProps {
  transactionDoc: TransactionDoc;
  refetch: () => void;
}

const EditTransaction = ({ transactionDoc, refetch }: EditTransactionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(transactionDoc.date);
  const [name, setName] = useState(transactionDoc.name);
  const [description, setDescription] = useState(transactionDoc.description);
  const [category, setCategory] = useState(transactionDoc.category);
  const [subcategory, setSubcategory] = useState(transactionDoc.subcategory);
  const [tags, setTags] = useState(transactionDoc.tags ?? []);
  const [amount, setAmount] = useState(transactionDoc.amount.toString());

  const editTransaction = async (event) => {
    event.preventDefault();
    setSubmitError(undefined);
    setIsSubmitting(true);
    try {
      await putTransaction({
        transactionId: transactionDoc.transactionId,
        date,
        name,
        description,
        category,
        subcategory,
        tags,
        amount: parseFloat(amount),
      });
      await queryClient.invalidateQueries(["transactionTags"]);
      await refetch();
      setIsOpen(false);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Please check your details and try again.",
      );
      setSubmitError(message);
      showToast({
        title: "Could not update transaction",
        description: message,
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
        onClick={() => setIsOpen(true)}
        aria-label="Edit transaction"
      >
        <ReactIcon icon={FaPencil} />
      </IconButton>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(event) => setIsOpen(event.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Edit Transaction</Dialog.Header>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Body>
                <Stack>
                  {submitError && (
                    <Alert.Root status="error" role="alert">
                      <Alert.Indicator />
                      <Alert.Description>{submitError}</Alert.Description>
                    </Alert.Root>
                  )}
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
                    aria-invalid={name === ""}
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
                  <InputGroup startElement="$">
                    <Input
                      value={amount}
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
                  onClick={editTransaction}
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
};

export default EditTransaction;
