import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { KeyboardEvent, useEffect, useId, useMemo, useState } from "react";
import { FaXmark } from "react-icons/fa6";
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
    const normalizedValue = value.trim().replace(/\s+/g, " ");
    const existingTag = tags.find(
      (tag) => tag === normalizedValue,
    );
    const selectedTag = existingTag ?? normalizedValue;
    setValue(selectedTag);
    onSelect(selectedTag);
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
            placeholder="Search tags and press Enter"
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
            {isLoading && <Spinner size="sm" mr={value ? 2 : 0} />}
            {value && (
              <IconButton
                type="button"
                aria-label="Clear tag filter"
                icon={<FaXmark />}
                size="sm"
                variant="ghost"
                onClick={() => {
                  setValue("");
                  onSelect("");
                  setIsOpen(false);
                  setActiveIndex(-1);
                }}
              />
            )}
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
        {isError && (
          <Alert status="error" mt={2} size="sm">
            <AlertIcon />
            Could not load tag suggestions. Press Enter to filter by the typed tag.
          </Alert>
        )}
      </FormControl>
    </Box>
  );
}

export default TagFilterInput;
