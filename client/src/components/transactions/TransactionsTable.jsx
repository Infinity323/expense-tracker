import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { DbContext } from "../../DbContext";
import EditTransaction from "./EditTransaction";
import DeleteTransaction from "./DeleteTransaction";

function TransactionsTable() {
  const db = useContext(DbContext);

  const [transactionDocs, setTransactionDocs] = useState();

  const loadTransactions = async () => {
    await db.createIndex({
      index: { fields: ["type"] },
    });
    await db.createIndex({
      index: { fields: ["date"] },
    });
    let result = await db.find({
      selector: { type: "transaction", date: { $exists: true } },
      sort: [{ date: "desc" }],
    });
    setTransactionDocs(result.docs);
  };

  useEffect(() => {
    loadTransactions();
  });

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
          {transactionDocs && transactionDocs.length ? (
            transactionDocs.map((transaction) => (
              <Tr>
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
  );
}

export default TransactionsTable;
