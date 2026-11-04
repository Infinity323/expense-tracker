import {
  Box,
  Button,
  Table,
  Alert,
  Skeleton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import {
  Dispatch,
  PointerEvent as ReactPointerEvent,
  SetStateAction,
  useCallback,
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
import { useToast } from "../ui/Toaster";

const TRANSACTION_COLUMNS = [
  { id: "date", label: "Date", minWidth: 88 },
  { id: "name", label: "Name", minWidth: 100 },
  {
    id: "account",
    label: "Account",
    minWidth: 100,
  },
  {
    id: "description",
    label: "Description",
    minWidth: 100,
  },
  {
    id: "category",
    label: "Category",
    minWidth: 88,
  },
  {
    id: "subcategory",
    label: "Subcategory",
    minWidth: 88,
  },
  { id: "tags", label: "Tags", minWidth: 88 },
  {
    id: "amount",
    label: "Amount",
    minWidth: 88,
  },
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
  tags: 150,
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
  tag?: string;
  onTagSelect: (tag: string) => void;
}

function TransactionsTable({
  reload,
  setReload,
  month,
  accountId,
  tag,
  onTagSelect,
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
    queryKey: ["transactions", { month, accountId, tag }],
    queryFn: getTransactions,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
  const toast = useToast();
  const [columnWidths, setColumnWidths] =
    useState<ColumnWidths>(loadColumnWidths);
  const resizeRef = useRef<{
    columnId: ResizableColumnId;
    adjacentColumnId: ResizableColumnId;
    startX: number;
    startWidth: number;
    startAdjacentWidth: number;
  } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const tableWidth =
    Object.values(columnWidths).reduce((total, width) => total + width, 0) +
    ACTIONS_COLUMN_WIDTH;
  const transactions = data?.pages.flatMap((page) => page.items) ?? [];
  const summary = data?.pages[0]?.summary;
  const { flattenedAccounts } = useAccounts();
  const accountNames = new Map(
    flattenedAccounts.map((account) => [account.account_id, account.name]),
  );
  const visibleTransactions = transactions?.filter((transaction) => {
    if (accountId === "all") return true;
    if (accountId === "manual") return !transaction.accountId;
    return transaction.accountId === accountId;
  });
  const showRefetchError = useCallback(() => {
    toast({
      title: "Could not refresh transactions",
      description: "Your changes may have been saved, but the list could not be refreshed. Please try again.",
      status: "error",
      isClosable: true,
    });
  }, [toast]);
  const refetchTransactions = useCallback(async () => {
    try {
      const result = await refetch();
      if (result.isError) showRefetchError();
    } catch {
      showRefetchError();
    }
  }, [refetch, showRefetchError]);
  const refetchTransactionPage = useCallback(
    async (transactionId: string) => {
      const pageIndex =
        data?.pages.findIndex((page) =>
          page.items.some((item) => item.transactionId === transactionId),
        ) ?? -1;
      if (pageIndex < 0) {
        await refetchTransactions();
        return;
      }

      try {
        const result = await refetch({
          refetchPage: (_page, index) =>
                              index === pageIndex || (Boolean(tag) && index === 0),
        });
        if (result.isError) showRefetchError();
      } catch {
        showRefetchError();
      }
    },
    [data?.pages, refetch, refetchTransactions, showRefetchError, tag],
  );

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
      void refetchTransactions();
      setReload(false);
    }
  }, [reload, setReload, refetchTransactions]);

  const startResize = (
    event: ReactPointerEvent<HTMLButtonElement>,
    columnId: ResizableColumnId,
  ) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const columnIndex = TRANSACTION_COLUMNS.findIndex(
      (column) => column.id === columnId,
    );
    const adjacentColumn =
      TRANSACTION_COLUMNS[
        columnIndex === TRANSACTION_COLUMNS.length - 1
          ? columnIndex - 1
          : columnIndex + 1
      ];
    resizeRef.current = {
      columnId,
      adjacentColumnId: adjacentColumn.id,
      startX: event.clientX,
      startWidth: columnWidths[columnId],
      startAdjacentWidth: columnWidths[adjacentColumn.id],
    };
  };

  const getResizedWidths = (clientX: number) => {
    const resize = resizeRef.current;
    if (!resize) return undefined;

    const column = TRANSACTION_COLUMNS.find(
      (candidate) => candidate.id === resize.columnId,
    );
    const adjacentColumn = TRANSACTION_COLUMNS.find(
      (candidate) => candidate.id === resize.adjacentColumnId,
    );
    if (!column || !adjacentColumn) return undefined;

    const delta = clientX - resize.startX;
    const minDelta = Math.max(
      column.minWidth - resize.startWidth,
      resize.startAdjacentWidth - 800,
    );
    const maxDelta = Math.min(
      800 - resize.startWidth,
      resize.startAdjacentWidth - adjacentColumn.minWidth,
    );
    const clampedDelta = Math.max(minDelta, Math.min(delta, maxDelta));

    return {
      ...columnWidths,
      [resize.columnId]: resize.startWidth + clampedDelta,
      [resize.adjacentColumnId]: resize.startAdjacentWidth - clampedDelta,
    };
  };

  const resizeColumn = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const nextWidths = getResizedWidths(event.clientX);
    if (nextWidths) setColumnWidths(nextWidths);
  };

  const finishResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const nextWidths = getResizedWidths(event.clientX);
    if (!nextWidths) return;

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
    <Box>
      {tag && (
        <Alert.Root status="info" mb={3}>
          <Alert.Indicator />
          {summary ? (
            <Text>
              <strong>{tag}</strong> · {summary.count} transactions · Net total{" "}
              {formatCurrency(summary.total)}
            </Text>
          ) : isError ? (
            <Text>Could not calculate the tag total. Please try again.</Text>
          ) : (
            <Text>Calculating the total for {tag}...</Text>
          )}
        </Alert.Root>
      )}
      <Table.ScrollArea width="100%" maxWidth="100%" overflowX="auto">
        <Table.Root
          size="sm"
          variant="line"
          striped
          css={{
            "& tableLayout": "fixed",
            "& & tbody td": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          }}
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
          <Table.Header>
            <Table.Row>
              {TRANSACTION_COLUMNS.map((column) => (
                <Table.ColumnHeader key={column.id} position="relative">
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
                    borderLeftWidth="1px"
                    borderColor="gray.300"
                    css={{ "& touchAction": "none" }}
                    _hover={{ borderColor: "teal.400" }}
                    _dark={{ borderColor: "whiteAlpha.300" }}
                    onPointerDown={(event) => startResize(event, column.id)}
                    onPointerMove={resizeColumn}
                    onPointerUp={finishResize}
                    onPointerCancel={finishResize}
                    unstyled
                  />
                </Table.ColumnHeader>
              ))}
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              Array.from({ length: 5 }, (_, rowIndex) => (
                <Table.Row key={`transaction-skeleton-${rowIndex}`}>
                  {Array.from(
                    { length: TRANSACTION_COLUMNS.length + 1 },
                    (_, columnIndex) => (
                      <Table.Cell
                        key={`transaction-skeleton-${rowIndex}-${columnIndex}`}
                      >
                        <Skeleton height="14px" />
                      </Table.Cell>
                    ),
                  )}
                </Table.Row>
              ))
            ) : isError && transactions.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={TRANSACTION_COLUMNS.length + 1}>
                  <Alert.Root status="error">
                    <Alert.Indicator />
                    Could not load transactions. Please try again.
                  </Alert.Root>
                </Table.Cell>
              </Table.Row>
            ) : visibleTransactions.length ? (
              visibleTransactions.map((transaction) => (
                <Table.Row key={transaction.transactionId}>
                  <Table.Cell>{transaction.date}</Table.Cell>
                  <Table.Cell>{transaction.name}</Table.Cell>
                  <Table.Cell
                    maxWidth="12rem"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {transaction.accountId
                      ? (accountNames.get(transaction.accountId) ??
                        "Linked account")
                      : "Manual"}
                  </Table.Cell>
                  <Table.Cell>{transaction.description}</Table.Cell>
                  <Table.Cell maxWidth="5" overflowX="hidden">
                    {transaction.category}
                  </Table.Cell>
                  <Table.Cell maxWidth="5" overflowX="hidden">
                    {transaction.subcategory}
                  </Table.Cell>
                  <Table.Cell>
                    {transaction.tags?.map((transactionTag) => (
                      <Button
                        key={transactionTag}
                        variant="solid"
                        size="xs"
                        colorPalette="teal"
                        borderRadius="full"
                        mr={2}
                        onClick={() => onTagSelect(transactionTag)}
                      >
                        {transactionTag}
                      </Button>
                    ))}
                  </Table.Cell>
                  <Table.Cell textAlign="end">
                    {formatCurrency(transaction.amount)}
                  </Table.Cell>
                  <Table.Cell padding="0">
                    <EditTransaction
                      transactionDoc={transaction}
                      refetch={() =>
                        refetchTransactionPage(transaction.transactionId)
                      }
                    />
                    <DeleteTransaction
                      transactionDoc={transaction}
                      refetch={refetch}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            ) : hasNextPage ? (
              <Table.Row>
                <Table.Cell colSpan={100}>Loading transactions...</Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell colSpan={100}>No transactions found.</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
        {isError && transactions.length > 0 && (
          <Alert.Root status="error" mt={2}>
            <Alert.Indicator />
            Could not load more transactions.
          </Alert.Root>
        )}
        {isFetchingNextPage && (
          <Text py={3} textAlign="center">
            <Spinner size="sm" mr={2} />
            Loading more transactions...
          </Text>
        )}
        <div
          ref={sentinelRef}
          aria-hidden="true"
          style={{ height: 1 }}
        />
      </Table.ScrollArea>
    </Box>
  );
}

export default TransactionsTable;
