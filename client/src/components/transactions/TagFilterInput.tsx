import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { KeyboardEvent, useEffect, useId, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getTransactionTags } from "../../services/transactionService";

interface TagFilterInputProps {
  selectedTag: string;
  onSelect: (tag: string) => void;
}

function TagFilterInput({ selectedTag, onSelect }: TagFilterInputProps) {
  const { data: tags = [], isLoading, isError } = useQuery(
    ["transactionTags"],
    getTransactionTags,
  );
  const [value, setValue] = useState(selectedTag);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();

  useEffect(() => {
    setValue(selectedTag);
  }, [selectedTag]);

  const suggestions = useMemo(() => {
    const search = value.trim().toLowerCase();
    return tags
      .filter((tag) => !search || tag.toLowerCase().includes(search))
      .slice(0, 8);
  }, [tags, value]);

  const applyTag = () => {
    onSelect(value.trim().replace(/\s+/g, " ").toLowerCase());
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const selectTag = (tag: string) => {
    setValue(tag);
    onSelect(tag);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (isOpen && activeIndex >= 0 && suggestions[activeIndex]) {
        selectTag(suggestions[activeIndex]);
      } else {
        applyTag();
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <Box
      as="form"
      position="relative"
      width={{ base: "100%", sm: "266px" }}
      onSubmit={(event) => {
        event.preventDefault();
        applyTag();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <FormControl>
        <FormLabel htmlFor="transaction-tag-filter">Filter by Tag</FormLabel>
        <InputGroup>
          <Input
            id="transaction-tag-filter"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search tags"
            maxLength={50}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen && suggestions.length > 0}
            aria-controls={listId}
            aria-activedescendant={
              activeIndex >= 0
                ? `${listId}-option-${activeIndex}`
                : undefined
            }
          />
          <InputRightElement width="4.5rem">
            <Button type="submit" size="sm">
              Apply
            </Button>
          </InputRightElement>
        </InputGroup>
        {isOpen && suggestions.length > 0 && (
          <Box
            id={listId}
            role="listbox"
            aria-label="Matching tags"
            position="absolute"
            zIndex="dropdown"
            mt={1}
            width="100%"
            maxHeight="15rem"
            overflowY="auto"
            borderWidth="1px"
            borderRadius="md"
            bg="chakra-body-bg"
            boxShadow="md"
            py={1}
          >
            {suggestions.map((tag, index) => (
              <Button
                id={`${listId}-option-${index}`}
                key={tag}
                role="option"
                aria-selected={index === activeIndex}
                tabIndex={-1}
                variant="ghost"
                size="sm"
                width="100%"
                justifyContent="flex-start"
                borderRadius={0}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </Box>
        )}
        {isLoading && (
          <Text fontSize="sm" mt={1} color="gray.500">
            Loading tags...
          </Text>
        )}
        {isError && (
          <Alert status="error" mt={2} size="sm">
            <AlertIcon />
            Could not load tag suggestions. You can still type a tag and apply it.
          </Alert>
        )}
        {selectedTag && (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => {
              setValue("");
              onSelect("");
            }}
          >
            Clear tag filter
          </Button>
        )}
      </FormControl>
    </Box>
  );
}

export default TagFilterInput;
