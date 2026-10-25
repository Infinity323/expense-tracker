import { AccountResponse } from "@backend/types/accountResponse";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Circle,
  Flex,
  Heading,
  Icon,
  Image,
  Spacer,
  Stack,
  StackDivider,
  Text,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { Institution } from "plaid";
import { FaCircleExclamation } from "react-icons/fa6";
import { useMutation } from "react-query";
import { useModal } from "../../../context/GlobalModalProvider";
import { deleteItem } from "../../../services/itemService";
import { formatCurrency } from "../../../utils/CurrencyUtil";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import LaunchLink from "../../launch-link/LaunchLink";

interface InstitutionCardProps {
  group: AccountResponse;
  institution: Institution;
  refetch: () => void;
}

const InstitutionCard = (props: InstitutionCardProps) => {
  const { group, institution, refetch } = props;
  const toast = useToast();
  const { mutate, isLoading } = useMutation(deleteItem, {
    onSuccess: refetch,
    onError: (error) => {
      toast({
        title: "Could not unlink institution",
        description: getErrorMessage(error, "Please try again."),
        status: "error",
        isClosable: true,
      });
    },
  });
  const { openModal } = useModal();

  const institutionName = institution.name;
  const logo = institution.logo;
  const color = institution.primary_color;

  const onUnlink = () => {
    openModal("confirmation", {
      header: "Unlink Institution",
      body: `Are you sure you want to unlink ${institutionName}? This will remove all accounts associated with this institution.`,
      confirmButton: {
        label: "Unlink",
        callback: () => mutate(group.item_id),
      },
    });
  };

  return (
    <Card p="1.5rem" variant="outline">
      <span style={{ backgroundColor: color, height: "5px" }} />
      <CardHeader>
        <Flex alignItems="center">
          <Box>
            <Heading as="h2" size="lg">
              {institutionName}
            </Heading>
            <Text fontSize="sm">
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
          {logo ? (
            <Image
              boxSize="75px"
              src={`data:image/png;base64,${logo}`}
              alt="logo"
            />
          ) : (
            <Circle size="75px" />
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Text fontWeight="semibold">
                  View Accounts ({group.accounts.length})
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Stack divider={<StackDivider />}>
                {group.accounts.map((account) => (
                  <Box>
                    <Text fontWeight="semibold">{account.name}</Text>
                    <Flex>
                      <Text>
                        {account.official_name} (...{account.mask})
                      </Text>
                      <Spacer />
                      <Text>{formatCurrency(account.balances.current)}</Text>
                    </Flex>
                    {account.balances.last_updated_datetime && (
                      <Text fontSize="sm">
                        Last updated{" "}
                        {format(
                          new Date(account.balances.last_updated_datetime),
                          "MMMM dd, yyyy",
                        )}
                      </Text>
                    )}
                  </Box>
                ))}
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </CardBody>
      <CardFooter>
        <ButtonGroup spacing={2}>
          <LaunchLink itemId={group.item_id}>Update</LaunchLink>
          <Button
            colorScheme="red"
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
