import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { getTransactions } from "../../services/TransactionService";
import LoadingModal from "../shared/LoadingModal";
import DeleteTransaction from "./DeleteTransaction";
import EditTransaction from "./EditTransaction";

function TransactionsTable({ reload, setReload }) {
  const [transactions, setTransactions] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  const loadTransactions = async () => {
    onOpenRef.current();
    setTransactions(await getTransactions());
    onCloseRef.current();
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (reload) {
      loadTransactions();
      setReload(false);
    }
  }, [reload, setReload]);

  return (
    <>
      <TableContainer>
        <Table size="sm" variant="striped">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Category</Th>
              <Th>Subcategory</Th>
              <Th isNumeric>Amount</Th>
              <Th width="0">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions && transactions.length ? (
              transactions.map((transaction) => (
                <Tr key={transaction._id}>
                  <Td>{transaction.date}</Td>
                  <Td>{transaction.name}</Td>
                  <Td>{transaction.description}</Td>
                  <Td>{transaction.category}</Td>
                  <Td>{transaction.subcategory}</Td>
                  <Td isNumeric>${transaction.amount}</Td>
                  <Td padding="0">
                    <EditTransaction transactionDoc={transaction} />
                    <DeleteTransaction
                      transactionDoc={transaction}
                      onDelete={loadTransactions}
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="100%">No transactions found.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <LoadingModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default TransactionsTable;
