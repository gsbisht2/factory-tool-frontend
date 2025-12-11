import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export const SearchBar = React.forwardRef((props, ref) => {
  // Pass the computed styles into the `__css` prop
  const {
    variant,
    background,
    children,
    placeholder,
    borderRadius,
    value, // add value prop
    onChange, // add onChange prop
    onFocus, // add onFocus prop
    onBlur, // add onBlur prop
    ...rest
  } = props;

  // Chakra Color Mode
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <InputGroup w={{ base: "100%", md: "300px" }} {...rest}>
      <InputLeftElement
        children={
          <IconButton
            bg="inherit"
            borderRadius="inherit"
            _hover="none"
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
            icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
          ></IconButton>
        }
      />
      <Input
        ref={ref}
        variant="search"
        fontSize="sm"
        // bg={background ? background : inputBg}
        color={textColor}
        borderRadius="1rem"
        border="2px lightgray solid"
        fontWeight="500"
        outline="none"
        _focus={{ boxShadow: "none" }}
        _placeholder={{ color: "gray.400", fontSize: "14px" }}
        placeholder={placeholder ? placeholder : "Search..."}
        value={value} // controlled value
        onChange={onChange} // controlled onChange
        onFocus={onFocus} // controlled onFocus
        onBlur={onBlur} // controlled onBlur
      />
    </InputGroup>
  );
});

SearchBar.displayName = "SearchBar";
