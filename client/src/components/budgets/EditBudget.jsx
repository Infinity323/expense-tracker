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
import { useContext, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { DbContext } from "../../DbContext";

function EditBudget({ budgetDoc }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const db = useContext(DbContext);

  const [category, setCategory] = useState(budgetDoc.category);
  const [subcategory, setSubcategory] = useState(budgetDoc.subcategory);
  const [amount, setAmount] = useState(budgetDoc.amount);

  const editBudget = async (event) => {
    event.preventDefault();
    budgetDoc.category = category;
    budgetDoc.subcategory = subcategory;
    budgetDoc.amount = amount;
    await db.put(budgetDoc);
    console.log(
      "Successfully added new budget document: %s",
      JSON.stringify(budgetDoc)
    );
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
          <ModalHeader>Edit Budget</ModalHeader>
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
              onClick={editBudget}
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

export default EditBudget;
