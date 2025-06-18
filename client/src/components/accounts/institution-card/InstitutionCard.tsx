import { AccountResponse } from "@backend/types/accountResponse";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Institution } from "plaid";
import { FaCircleExclamation } from "react-icons/fa6";
import { useUserContext } from "../../../context/UserProvider";
import { useCreateLinkToken } from "../../../hooks/useCreateLinkToken";
import LaunchLink from "../../launch-link/LaunchLink";
import { useMutation } from "react-query";
import { deleteItem } from "../../../services/itemService";

interface InstitutionCardProps {
  group: AccountResponse;
  institution: Institution;
  accessToken: string;
  refetch: () => void;
}

const InstitutionCard: React.FC<InstitutionCardProps> = (props) => {
  const { group, institution, accessToken, refetch } = props;
  const {
    userInfo: { userId },
  } = useUserContext();
  const linkToken = useCreateLinkToken({
    userId,
    accessToken,
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: deleteItem,
    onSuccess: refetch,
  });

  const institutionName = institution.name;
  const logo = institution.logo;
  const color = institution.primary_color;

  const onUnlink = () => mutate(group.item_id);

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
          {logo && (
            <Image
              boxSize="75px"
              src={`data:image/png;base64,${logo}`}
              alt="logo"
            />
          )}
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
        <ButtonGroup spacing={2}>
          {linkToken ? (
            <LaunchLink linkToken={linkToken} itemId={group.item_id}>
              Update
            </LaunchLink>
          ) : (
            <Button isLoading disabled>
              Update
            </Button>
          )}
          <Button
            colorScheme="red"
            disabled={isLoading}
            isLoading={isLoading}
            onClick={onUnlink}
          >
            Unlink
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default InstitutionCard;
