import { Box, Skeleton } from "@chakra-ui/react";
import { useUserContext } from "../../../context/UserProvider";
import { useAccounts } from "../../../hooks/useAccounts";
import { useLinkedInstitutions } from "../../../hooks/useLinkedInstitutions";
import InstitutionCard from "../institution-card/InstitutionCard";

const InstitutionGroups = () => {
  const { accounts, isLoading: isAccountsLoading, refetch } = useAccounts();
  const { institutions, isLoading: isInstitutionsLoading } =
    useLinkedInstitutions();
  const { accessTokens } = useUserContext();

  if (isAccountsLoading || isInstitutionsLoading) {
    return <Skeleton height="200px" />;
  }

  if (!accounts?.length) {
    return <Box p="1rem">No accounts linked.</Box>;
  }

  return (
    <>
      {accounts.map((group) => {
        const institution = institutions.find(
          (institution) =>
            institution.institution.institution_id === group.institution_id,
        )?.institution;
        if (!institution) {
          return null;
        }

        const accessToken = accessTokens.find(
          (accessToken) => accessToken.itemId === group.item_id,
        ).accessToken;
        return (
          <InstitutionCard
            group={group}
            institution={institution}
            accessToken={accessToken}
            refetch={refetch}
          />
        );
      })}
    </>
  );
};

export default InstitutionGroups;
