import { Alert, AlertIcon, Box, Skeleton } from "@chakra-ui/react";
import { useAccounts } from "../../../hooks/useAccounts";
import { useLinkedInstitutions } from "../../../hooks/useLinkedInstitutions";
import InstitutionCard from "../institution-card/InstitutionCard";

const InstitutionGroups = () => {
  const {
    accounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    refetch,
  } = useAccounts();
  const {
    institutions,
    isLoading: isInstitutionsLoading,
    isError: isInstitutionsError,
  } =
    useLinkedInstitutions();

  if (isAccountsLoading || isInstitutionsLoading) {
    return <Skeleton height="200px" />;
  }

  if (isAccountsError || isInstitutionsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Could not load linked accounts. Please retry or sign in again.
      </Alert>
    );
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

        return (
          <InstitutionCard
            group={group}
            institution={institution}
            refetch={refetch}
          />
        );
      })}
    </>
  );
};

export default InstitutionGroups;
