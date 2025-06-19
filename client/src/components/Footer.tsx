import {
  ButtonGroup,
  Center,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Center padding="2rem">
      <VStack spacing={1.5}>
        <Text fontSize="sm">
          Developed by Paul Lee. Made with Chakra UI. Powered by Plaid.
        </Text>
        <ButtonGroup spacing={0.5} variant="transparent" color="gray.400">
          <Link
            to="https://github.com/infinity323"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton aria-label="GitHub" icon={<FaGithub />} />
          </Link>
          <Link
            to="https://linkedin.com/in/paul-lee-swe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton aria-label="LinkedIn" icon={<FaLinkedin />} />
          </Link>
        </ButtonGroup>
      </VStack>
    </Center>
  );
}

export default Footer;
