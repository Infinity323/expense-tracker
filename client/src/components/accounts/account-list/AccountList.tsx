import { Stack } from "@chakra-ui/react";
import { useBalances } from "../../../hooks/useBalances";

interface AccountListProps {}

const AccountList: React.FC<AccountListProps> = (props) => {
  const { balances } = useBalances();

  return <Stack>Hi</Stack>;
};

export default AccountList;
