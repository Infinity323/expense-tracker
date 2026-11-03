import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Alert,
  AlertIcon,
  Skeleton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import {
  Dispatch,
  PointerEvent as ReactPointerEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInfiniteQuery } from "react-query";
import { useAccounts } from "../../hooks/useAccounts";
import { getTransactions } from "../../services/transactionService";
import { formatCurrency } from "../../utils/CurrencyUtil";
import DeleteTransaction from "./DeleteTransaction";
import EditTransaction from "./EditTransaction";

const TRANSACTION_COLUMNS = [
  { id: "date", label: "Date", minWidth: 88 },
  { id: "name", label: "Name", minWidth: 100 },
  { id: "account", label: "Account", minWidth: 100 },
  { id: "description", label: "Description", minWidth: 100 },
  { id: "category", label: "Category", minWidth: 88 },
  { id: "subcategory", label: "Subcategory", minWidth: 88 },
  { id: "amount", label: "Amount", minWidth: 88 },
] as const;

type ResizableColumnId = (typeof TRANSACTION_COLUMNS)[number]["id"];
type ColumnWidths = Record<ResizableColumnId, number>;

const COLUMN_WIDTHS_STORAGE_KEY = "transactions-table-column-widths";
const ACTIONS_COLUMN_WIDTH = 88;
const DEFAULT_COLUMN_WIDTHS: ColumnWidths = {
  date: 120,
  name: 180,
  account: 160,
  description: 220,
  category: 150,
  subcategory: 150,
  amount: 120,
};

function loadColumnWidths(): ColumnWidths {
  try {
    const storedWidths = window.localStorage.getItem(COLUMN_WIDTHS_STORAGE_KEY);
    if (!storedWidths) return { ...DEFAULT_COLUMN_WIDTHS };

    const parsedWidths = JSON.parse(storedWidths) as Record<string, unknown>;
    return TRANSACTION_COLUMNS.reduce(
      (widths, column) => {
        const storedWidth = parsedWidths[column.id];
        if (typeof storedWidth === "number" && Number.isFinite(storedWidth)) {
          widths[column.id] = Math.max(
            column.minWidth,
            Math.min(storedWidth, 800),
          );
        }
        return widths;
      },
      { ...DEFAULT_COLUMN_WIDTHS },
    );
  } catch (error) {
    console.error("Could not load transaction table column widths.", error);
    return { ...DEFAULT_COLUMN_WIDTHS };
  }
}

interface TransactionsTableProps {
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
  month?: string;
  accountId: string;
}

function TransactionsTable({
  reload,
  setReload,
  month,
  accountId,
}: TransactionsTableProps) {
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["transactions", { month, accountId }],
    queryFn: getTransactions,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
  const [columnWidths, setColumnWidths] =
    useState<ColumnWidths>(loadColumnWidths);
  const resizeRef = useRef<{
    columnId: ResizableColumnId;
    startX: number;
    startWidth: number;
  } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const tableWidth =
    Object.values(columnWidths).reduce((total, width) => total + width, 0) +
    ACTIONS_COLUMN_WIDTH;
  const transactions = data?.pages.flatMap((page) => page.items) ?? [];
  const { flattenedAccounts } = useAccounts();
  const accountNames = new Map(
    flattenedAccounts.map((account) => [account.account_id, account.name]),
  );
  const visibleTransactions = transactions?.filter((transaction) => {
    if (accountId === "all") return true;
    if (accountId === "manual") return !transaction.accountId;
    return transaction.accountId === accountId;
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchNextPage();
      },
      { rootMargin: "300px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (reload) {
      refetch();
      setReload(false);
    }
  }, [reload, setReload, refetch]);

  const startResize = (
    event: ReactPointerEvent<HTMLButtonElement>,
    columnId: ResizableColumnId,
  ) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = {
      columnId,
      startX: event.clientX,
      startWidth: columnWidths[columnId],
    };
  };

  const resizeColumn = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const resize = resizeRef.current;
    if (!resize) return;

    const column = TRANSACTION_COLUMNS.find(
      (candidate) => candidate.id === resize.columnId,
    );
    if (!column) return;

    setColumnWidths((widths) => ({
      ...widths,
      [resize.columnId]: Math.max(
        column.minWidth,
        Math.min(resize.startWidth + event.clientX - resize.startX, 800),
      ),
    }));
  };

  const finishResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const resize = resizeRef.current;
    if (!resize) return;

    const column = TRANSACTION_COLUMNS.find(
      (candidate) => candidate.id === resize.columnId,
    );
    if (!column) return;

    const width = Math.max(
      column.minWidth,
      Math.min(resize.startWidth + event.clientX - resize.startX, 800),
    );
    const nextWidths = { ...columnWidths, [resize.columnId]: width };
    setColumnWidths(nextWidths);
    resizeRef.current = null;

    try {
      window.localStorage.setItem(
        COLUMN_WIDTHS_STORAGE_KEY,
        JSON.stringify(nextWidths),
      );
    } catch (error) {
      console.error("Could not save transaction table column widths.", error);
    }
  };

  return (
    <TableContainer width="100%" maxWidth="100%" overflowX="auto">
      <Table
        size="sm"
        variant="striped"
        sx={{ tableLayout: "fixed" }}
        width={`${tableWidth}px`}
        minWidth={`${tableWidth}px`}
      >
        <colgroup>
          {TRANSACTION_COLUMNS.map((column) => (
            <col
              key={column.id}
              style={{ width: `${columnWidths[column.id]}px` }}
            />
          ))}
          <col style={{ width: `${ACTIONS_COLUMN_WIDTH}px` }} />
        </colgroup>
        <Thead>
          <Tr>
            {TRANSACTION_COLUMNS.map((column) => (
              <Th key={column.id} position="relative">
                {column.label}
                <Button
                  type="button"
                  aria-label={`Resize ${column.label} column`}
                  title={`Drag to resize ${column.label} column`}
                  position="absolute"
                  top={0}
                  right={0}
                  width="12px"
                  height="100%"
                  minWidth={0}
                  padding={0}
                  cursor="col-resize"
                  variant="unstyled"
                  borderLeftWidth="1px"
                  borderColor="gray.300"
                  sx={{ touchAction: "none" }}
                  _hover={{ borderColor: "teal.400" }}
                  _dark={{ borderColor: "whiteAlpha.300" }}
                  onPointerDown={(event) => startResize(event, column.id)}
                  onPointerMove={resizeColumn}
                  onPointerUp={finishResize}
                  onPointerCancel={finishResize}
                />
              </Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            Array.from({ length: 5 }, (_, rowIndex) => (
              <Tr key={`transaction-skeleton-${rowIndex}`}>
                {Array.from({ length: 8 }, (_, columnIndex) => (
                  <Td key={`transaction-skeleton-${rowIndex}-${columnIndex}`}>
                    <Skeleton height="14px" />
                  </Td>
                ))}
              </Tr>
            ))
          ) : isError && transactions.length === 0 ? (
            <Tr>
              <Td colSpan={8}>
                <Alert status="error">
                  <AlertIcon />
                  Could not load transactions. Please try again.
                </Alert>
              </Td>
            </Tr>
          ) : visibleTransactions.length ? (
            visibleTransactions.map((transaction) => (
              <Tr key={transaction.transactionId}>
                <Td>{transaction.date}</Td>
                <Td>{transaction.name}</Td>
                <Td
                  maxWidth="12rem"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {transaction.accountId
                    ? accountNames.get(transaction.accountId) ??
                      "Linked account"
                    : "Manual"}
                </Td>
                <Td>{transaction.description}</Td>
                <Td maxWidth="5" overflowX="hidden">
                  {transaction.category}
                </Td>
                <Td maxWidth="5" overflowX="hidden">
                  {transaction.subcategory}
                </Td>
                <Td isNumeric>{formatCurrency(transaction.amount)}</Td>
                <Td padding="0">
                  <EditTransaction
                    transactionDoc={transaction}
                    refetch={refetch}
                  />
                  <DeleteTransaction
                    transactionDoc={transaction}
                    refetch={refetch}
                  />
                </Td>
              </Tr>
            ))
          ) : hasNextPage ? (
            <Tr>
              <Td colSpan={100}>Loading transactions...</Td>
            </Tr>
          ) : (
            <Tr>
              <Td colSpan={100}>No transactions found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {isError && transactions.length > 0 && (
        <Alert status="error" mt={2}>
          <AlertIcon />
          Could not load more transactions.
        </Alert>
      )}
      {isFetchingNextPage && (
        <Text py={3} textAlign="center">
          <Spinner size="sm" mr={2} />
          Loading more transactions...
        </Text>
      )}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
    </TableContainer>
  );
}

export default TransactionsTable;
