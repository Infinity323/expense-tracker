import {
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
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useAccounts } from "../../hooks/useAccounts";
import { getTransactions } from "../../services/transactionService";
import { formatCurrency } from "../../utils/CurrencyUtil";
import DeleteTransaction from "./DeleteTransaction";
import EditTransaction from "./EditTransaction";

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
  const sentinelRef = useRef<HTMLDivElement>(null);
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

  return (
    <TableContainer>
      <Table size="sm" variant="striped">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Name</Th>
            <Th>Account</Th>
            <Th>Description</Th>
            <Th>Category</Th>
            <Th>Subcategory</Th>
            <Th isNumeric>Amount</Th>
            <Th width="0">Actions</Th>
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
