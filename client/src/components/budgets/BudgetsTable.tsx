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
import { useModal } from "../../context/GlobalModalProvider";
import { useBudgets } from "../../hooks/useBudgets";
import { formatCurrency } from "../../utils/CurrencyUtil";
import DeleteBudget from "./DeleteBudget";
import EditBudget from "./EditBudget";

function BudgetsTable({ reload, setReload }) {
  const { budgets, isLoading, refetch } = useBudgets();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (reload) {
      refetch();
      setReload(false);
    }
  }, [reload, setReload, refetch]);

  useEffect(() => {
    if (isLoading) openModal("loading", { body: "Loading..." });
    else closeModal("loading");
  }, [isLoading]);

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
          {budgets?.length ? (
            budgets
              .filter((budget) => budget.amount)
              .map((budget) => (
                <Tr key={budget._id}>
                  <Td>{budget.category}</Td>
                  <Td>{budget.subcategory}</Td>
                  <Td isNumeric>{formatCurrency(budget.amount)}</Td>
                  <Td padding="0" width="0">
                    <EditBudget budgetDoc={budget} refetch={refetch} />
                    {!budget.isMaster && (
                      <DeleteBudget budgetDoc={budget} onDelete={refetch} />
                    )}
                  </Td>
                </Tr>
              ))
          ) : (
            <Tr>
              <Td colSpan={100}>No budgets found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default BudgetsTable;
