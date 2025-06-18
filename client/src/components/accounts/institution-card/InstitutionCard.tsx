import { AccountResponse } from "@backend/types/accountResponse";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Skeleton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { FaCircleExclamation } from "react-icons/fa6";
import { useUserContext } from "../../../context/UserProvider";
import { useCreateLinkToken } from "../../../hooks/useCreateLinkToken";
import { useLinkedInstitutions } from "../../../hooks/useLinkedInstitutions";
import LaunchLink from "../../launch-link/LaunchLink";

interface InstitutionCardProps {
  group: AccountResponse;
}

const InstitutionCard: React.FC<InstitutionCardProps> = (props) => {
  const { group } = props;
  const { institutions, isLoading } = useLinkedInstitutions();
  const {
    userInfo: { userId },
    accessTokens,
  } = useUserContext();
  const linkToken = useCreateLinkToken({
    userId,
    accessToken: accessTokens?.find(
      (accessToken) => accessToken.itemId === group.item_id
    ).accessToken,
  });

  const institution = institutions?.find(
    (institution) =>
      institution.institution.institution_id === group.institution_id
  )?.institution;

  if (isLoading) {
    return (
      <Card p="1.5rem" variant="outline">
        <CardHeader>
          <Skeleton height="20px" width="50%" />
        </CardHeader>
        <CardBody>
          <Skeleton height="150px" />
        </CardBody>
      </Card>
    );
  }

  const institutionName = institution?.name;
  const logo = institution?.logo;
  const color = institution?.primary_color;

  return (
    <Card p="1.5rem" variant="outline">
      <span style={{ backgroundColor: color, height: "5px" }} />
      <CardHeader>
        <Flex alignItems="center">
          <Box>
            <Heading as="h2" size="lg">
              {institutionName}
            </Heading>
            <Text>
              Linked on {new Date(group.created_timestamp).toLocaleDateString()}
            </Text>
            {group.needs_attention && (
              <>
                <Icon
                  as={FaCircleExclamation}
                  verticalAlign="center"
                  color="red"
                />
                <Text as="span" color="red">
                  Needs attention!
                </Text>
              </>
            )}
          </Box>
          <Spacer />
          {logo && <Image
            boxSize="75px"
            src={`data:image/png;base64,${logo}`}
            alt="logo"
          />}
        </Flex>
      </CardHeader>
      <CardBody>
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          {group.accounts.map((account) => (
            <Card variant="outline">
              <CardBody>
                <Text fontWeight="semibold">{account.name}</Text>
                <Text>
                  {account.official_name} (...{account.mask})
                </Text>
                <Text>{account.balances.last_updated_datetime}</Text>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </CardBody>
      <CardFooter>
        <Box>
          {linkToken ? (
            <LaunchLink linkToken={linkToken} itemId={group.item_id}>
              Update
            </LaunchLink>
          ) : (
            <Button isLoading disabled>
              Update
            </Button>
          )}
        </Box>
      </CardFooter>
    </Card>
  );
};

export default InstitutionCard;
