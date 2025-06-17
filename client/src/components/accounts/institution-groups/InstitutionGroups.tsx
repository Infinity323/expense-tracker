import { Box, Skeleton } from "@chakra-ui/react";
import React from "react";
import { useAccounts } from "../../../hooks/useAccounts";
import InstitutionCard from "../institution-card/InstitutionCard";

const InstitutionGroups: React.FC = () => {
  const { accounts, isLoading } = useAccounts();

  if (isLoading) {
    return <Skeleton height="200px" />;
  }

  if (!accounts?.length) {
    return <Box p="1rem">No accounts linked.</Box>;
  }

  return (
    <>
      {accounts.map((group) => (
        <InstitutionCard group={group} />
      ))}
    </>
  );
};

export default InstitutionGroups;
