import {
  Box,
  Button,
  Input,
  InputGroup,
  Tag,
  Wrap,
  Field,
} from "@chakra-ui/react";
import { KeyboardEvent, useId, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getTransactionTags } from "../../services/transactionService";

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const normalizeTag = (tag: string) => tag.trim().replace(/\s+/g, " ");

function TagsInput({ tags, setTags }: TagsInputProps) {
  const { data: existingTags = [] } = useQuery(
    ["transactionTags"],
    getTransactionTags,
  );
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // Use React.useId instead (available in React 18+)
  const listId = useId();
  const suggestions = useMemo(() => {
    const search = value.trim().toLowerCase();
    return existingTags
      .filter(
        (tag) =>
          !tags.includes(tag) &&
          (!search || tag.toLowerCase().includes(search)),
      )
      .slice(0, 8);
  }, [existingTags, tags, value]);

  const addTag = () => {
    const normalizedValue = normalizeTag(value);
    const tag =
      existingTags.find((existingTag) => existingTag === normalizedValue) ??
      normalizedValue;
    if (!tag || tags.length >= 20) return;
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setValue("");
    setIsOpen(false);
  };

  const selectTag = (tag: string) => {
    setTags([...tags, tag]);
    setValue("");
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <Field.Root
      position="relative"
      onBlur={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setIsOpen(false);
        }
      }}
    >
      <Field.Label>Tags</Field.Label>
      <InputGroup
        endElement={
          <Button
            type="button"
            size="sm"
            onClick={addTag}
            disabled={tags.length >= 20}
          >
            Add
          </Button>
        }
      >
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type a tag and press Enter"
          maxLength={50}
          disabled={tags.length >= 20}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-controls={listId}
        />
      </InputGroup>
      {isOpen && suggestions.length > 0 && (
        <Box
          id={listId}
          role="listbox"
          aria-label="Existing tags"
          position="absolute"
          zIndex="dropdown"
          mt={1}
          width="100%"
          maxHeight="12rem"
          overflowY="auto"
          borderWidth="1px"
          borderRadius="md"
          bg="bg"
          boxShadow="md"
          py={1}
        >
          {suggestions.map((tag) => (
            <Button
              key={tag}
              role="option"
              aria-selected="false"
              tabIndex={-1}
              variant="ghost"
              size="sm"
              width="100%"
              justifyContent="flex-start"
              borderRadius={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </Box>
      )}
      {tags.length > 0 && (
        <Wrap mt={2}>
          {tags.map((tag) => (
            <Tag.Root key={tag} size="md" colorPalette="teal" variant="solid">
              <Tag.Label>{tag}</Tag.Label>
              <Tag.CloseTrigger
                aria-label={`Remove ${tag} tag`}
                onClick={() =>
                  setTags(tags.filter((current) => current !== tag))
                }
              />
            </Tag.Root>
          ))}
        </Wrap>
      )}
    </Field.Root>
  );
}

export default TagsInput;
