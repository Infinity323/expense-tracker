import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
import { KeyboardEvent, useState } from "react";

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const normalizeTag = (tag: string) =>
  tag.trim().replace(/\s+/g, " ").toLowerCase();

function TagsInput({ tags, setTags }: TagsInputProps) {
  const [value, setValue] = useState("");

  const addTag = () => {
    const tag = normalizeTag(value);
    if (!tag || tags.length >= 20) return;
    if (!tags.includes(tag)) setTags([...tags, tag]);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <FormControl>
      <FormLabel>Tags</FormLabel>
      <InputGroup>
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a tag and press Enter"
          maxLength={50}
          isDisabled={tags.length >= 20}
        />
        <InputRightElement width="3.5rem">
          <Button
            type="button"
            size="sm"
            onClick={addTag}
            isDisabled={tags.length >= 20}
          >
            Add
          </Button>
        </InputRightElement>
      </InputGroup>
      {tags.length > 0 && (
        <Wrap mt={2}>
          {tags.map((tag) => (
            <Tag key={tag} size="md" colorScheme="teal">
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton
                aria-label={`Remove ${tag} tag`}
                onClick={() =>
                  setTags(tags.filter((current) => current !== tag))
                }
              />
            </Tag>
          ))}
        </Wrap>
      )}
    </FormControl>
  );
}

export default TagsInput;
