import { Box, Heading, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import LoadingModal from "../components/shared/LoadingModal";
import CategorySpendingOverTimeChart from "../components/trends/CategorySpendingOverTimeChart";

function Insights() {
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    if (isLoading) {
      onOpenRef.current();
    } else {
      onCloseRef.current();
    }
  }, [isLoading]);

  return (
    <>
      <Box padding="5rem">
        <Heading as="h2" size="lg">
          Spending Trends
        </Heading>
        <Heading as="h3" size="md">
          Monthly Spending By Category
        </Heading>
        <CategorySpendingOverTimeChart setIsLoading={setIsLoading} />
      </Box>
      <LoadingModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Insights;
