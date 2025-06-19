import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useLoadingModal } from "../../hooks/useLoadingModal";
import { getTransactions } from "../../services/transactionService";
import { formatCurrency } from "../../utils/CurrencyUtil";
import DeleteTransaction from "./DeleteTransaction";
import EditTransaction from "./EditTransaction";

function TransactionsTable({ reload, setReload }) {
  const {
    data: transactions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
  useLoadingModal({ isLoading });

  useEffect(() => {
    if (reload) {
      refetch();
      setReload(false);
    }
  }, [reload, setReload, refetch]);

  return (
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
                <Td maxWidth="5" overflowX="hidden">
                  {transaction.category}
                </Td>
                <Td maxWidth="5" overflowX="hidden">
                  {transaction.subcategory}
                </Td>
                <Td isNumeric>{formatCurrency(transaction.amount)}</Td>
                <Td padding="0">
                  <EditTransaction transactionDoc={transaction} />
                  <DeleteTransaction
                    transactionDoc={transaction}
                    onDelete={refetch}
                  />
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={100}>No transactions found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default TransactionsTable;
