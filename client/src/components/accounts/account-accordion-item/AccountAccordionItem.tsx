import { AccountResponse } from "@backend/types/accountResponse";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { useUserContext } from "../../../context/UserProvider";
import { useCreateLinkToken } from "../../../hooks/useCreateLinkToken";
import LaunchLink from "../../launch-link/LaunchLink";
import { useLinkedInstitutions } from "../../../hooks/useLinkedInstitutions";

interface AccountAccordionItemProps {
  account: AccountResponse;
}

const AccountAccordionItem: React.FC<AccountAccordionItemProps> = (props) => {
  const { account } = props;
  const { institutions } = useLinkedInstitutions();
  const {
    userInfo: { userId },
    accessTokens,
  } = useUserContext();
  const linkToken = useCreateLinkToken({
    userId,
    accessToken: accessTokens?.find((token) => token.itemId === account.item_id)
      .accessToken,
  });
  const institutionName = institutions?.find(
    (institution) =>
      institution.institution.institution_id === account.institution_id
  )?.institution.name;

  return (
    <AccordionItem key={account.account_id}>
      <Heading as="h3" size="md">
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            <HStack>
              <Text as="span" fontWeight="bold">
                {institutionName} {account.name}
              </Text>
              {account.needs_attention && (
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
            </HStack>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel pb={4}>
        {account.official_name} (...{account.mask})
        <br />
        Linked on {new Date(account.created_timestamp).toLocaleDateString()}
        <br />
        {linkToken && (
          <LaunchLink linkToken={linkToken} itemId={account.item_id}>
            Update
          </LaunchLink>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AccountAccordionItem;
