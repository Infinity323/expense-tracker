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
import { getBudgets } from "../../services/budgetService";
import LoadingModal from "../shared/LoadingModal";
import DeleteBudget from "./DeleteBudget";
import EditBudget from "./EditBudget";
import { formatCurrency } from "../../utils/CurrencyUtil";

function BudgetsTable({ reload, setReload }) {
  const {
    data: budgets,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets,
  });

  useEffect(() => {
    if (reload) {
      refetch();
      setReload(false);
    }
  }, [reload, setReload, refetch]);

  return (
    <>
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
      <LoadingModal isLoading={reload || isLoading} />
    </>
  );
}

export default BudgetsTable;
