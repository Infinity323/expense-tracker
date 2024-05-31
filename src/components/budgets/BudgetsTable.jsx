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
import EditBudget from "./EditBudget";
import DeleteBudget from "./DeleteBudget";

function BudgetsTable() {
  const db = useContext(DbContext);

  const [budgetDocs, setBudgetDocs] = useState();

  const loadBudgets = async () => {
    await db.createIndex({
      index: { fields: ["type"] },
    });
    await db.createIndex({
      index: { fields: ["category"] },
    });
    await db.createIndex({
      index: { fields: ["subcategory"] },
    });
    let result = await db.find({
      selector: {
        type: "budget",
        category: { $exists: true },
        subcategory: { $exists: true },
      },
      sort: [{ category: "asc", subcategory: "asc" }],
    });
    setBudgetDocs(result.docs);
  };

  useEffect(() => {
    loadBudgets();
  });

  return (
    <TableContainer>
      <Table size="sm" variant="striped">
        <Thead>
          <Tr>
            <Th>Category</Th>
            <Th>Subcategory</Th>
            <Th isNumeric>Monthly Amount</Th>
            {/* 0% to make Actions column as small as possible */}
            <Th width="0">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {budgetDocs && budgetDocs.length ? (
            budgetDocs.map((budget) => (
              <Tr>
                <Td>{budget.category}</Td>
                <Td>{budget.subcategory}</Td>
                <Td isNumeric>${budget.amount}</Td>
                <Td padding="0" width="0">
                  <EditBudget budgetDoc={budget} />
                  <DeleteBudget budgetDoc={budget} onDelete={loadBudgets} />
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="100%">No budgets found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default BudgetsTable;
