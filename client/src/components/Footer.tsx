import {
  ButtonGroup,
  Center,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ReactIcon } from "./ui/ReactIcon";

function Footer() {
  return (
    <Center padding={{ base: "1.5rem 1rem", md: "2rem" }}>
      <VStack gap={1.5}>
        <Text fontSize="sm" textAlign="center">
          Developed by Paul Lee. Made with Chakra UI. Powered by Plaid.
        </Text>
        <ButtonGroup gap={0.5} variant="plain" color="gray.400">
          <Link
            to="https://github.com/infinity323"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton aria-label="GitHub">
              <ReactIcon icon={FaGithub} />
            </IconButton>
          </Link>
          <Link
            to="https://linkedin.com/in/paul-lee-swe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton aria-label="LinkedIn">
              <ReactIcon icon={FaLinkedin} />
            </IconButton>
          </Link>
        </ButtonGroup>
      </VStack>
    </Center>
  );
}

export default Footer;
