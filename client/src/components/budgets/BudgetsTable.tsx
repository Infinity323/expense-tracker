import {
  Alert,
  Table,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useBudgets } from "../../hooks/useBudgets";
import { formatCurrency } from "../../utils/CurrencyUtil";
import DeleteBudget from "./DeleteBudget";
import EditBudget from "./EditBudget";

function BudgetsTable({ reload, setReload }) {
  const { budgets, isLoading, isError, refetch } = useBudgets();

  useEffect(() => {
    if (reload) {
      refetch();
      setReload(false);
    }
  }, [reload, setReload, refetch]);

  const displayedBudgets = budgets?.filter((budget) => budget.amount);

  if (isError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Description>
          Could not load budgets. Please try again.
        </Alert.Description>
      </Alert.Root>
    );
  }

  return (
    <Table.ScrollArea>
      <Table.Root size="sm" variant="line" striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Subcategory</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">
              Monthly Amount
            </Table.ColumnHeader>
            {/* 0% to make Actions column as small as possible */}
            <Table.ColumnHeader width="0">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            Array.from({ length: 5 }, (_, rowIndex) => (
              <Table.Row key={`budget-skeleton-${rowIndex}`}>
                {Array.from({ length: 4 }, (_, columnIndex) => (
                  <Table.Cell
                    key={`budget-skeleton-${rowIndex}-${columnIndex}`}
                  >
                    <Skeleton height="14px" />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          ) : displayedBudgets?.length ? (
            displayedBudgets.map((budget) => (
              <Table.Row key={budget.budgetId}>
                <Table.Cell>{budget.category}</Table.Cell>
                <Table.Cell>{budget.subcategory}</Table.Cell>
                <Table.Cell textAlign="end">
                  {formatCurrency(budget.amount)}
                </Table.Cell>
                <Table.Cell padding="0" width="0">
                  <EditBudget budgetDoc={budget} refetch={refetch} />
                  {!budget.isMaster && (
                    <DeleteBudget budgetDoc={budget} onDelete={refetch} />
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={100}>No budgets found.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}

export default BudgetsTable;
