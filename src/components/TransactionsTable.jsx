import {
  CircularProgress,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFind } from "use-pouchdb";

function TransactionsTable() {
  const { transactionDocs, loading, error } = useFind({
    index: {
      fields: ["type"],
      name: "type",
    },
    selector: {
      type: "transaction",
    },
  });

  useEffect(() => {
    if (!loading) {
      console.log(
        "Finished loading transactions: %s",
        JSON.stringify(transactionDocs)
      );
    }
  }, [transactionDocs, loading]);

  useEffect(() => {
    if (error) {
      console.error("Error: %s", JSON.stringify(error));
    }
  }, [error]);

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
          </Tr>
        </Thead>
        <Tbody>
          {error && (
            <Tr>
              <Td colSpan="100%">
                Error: {error.status} - {error.name}
              </Td>
            </Tr>
          )}
          {loading && !transactionDocs && (
            <Tr>
              <Td colSpan="100%">
                <CircularProgress isIndeterminate size="2.5rem" color="teal" />
              </Td>
            </Tr>
          )}
          {transactionDocs && !error ? (
            transactionDocs.map((transaction) => (
              <Tr>
                <Td>{transaction.date}</Td>
                <Td>{transaction.name}</Td>
                <Td>{transaction.description}</Td>
                <Td>{transaction.category}</Td>
                <Td>{transaction.subcategory}</Td>
                <Td isNumeric>${transaction.amount}</Td>
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
  );
}

export default TransactionsTable;
