import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getBudgets } from "../../services/BudgetService";
import DeleteBudget from "./DeleteBudget";
import EditBudget from "./EditBudget";

function BudgetsTable({ reload, setReload }) {
  const [budgets, setBudgets] = useState([]);

  const loadBudgets = async () => {
    setBudgets(await getBudgets());
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  useEffect(() => {
    if (reload) {
      loadBudgets();
      setReload(false);
    }
  }, [reload, setReload]);

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
          {budgets && budgets.length ? (
            budgets.map((budget) => (
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
