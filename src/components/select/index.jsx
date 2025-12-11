import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const InterfaceSelect = ({ value, options, onChange, width }) => {
  const inputBg = useColorModeValue("white", "navy.600");
  const textColor = useColorModeValue("navy.700", "white");
  const hoverBg = useColorModeValue("gray.200", "navy.500");
  const focusBorderColor = useColorModeValue("navy.500", "navy.300");

  const [selected, setSelected] = React.useState(value ?? null);

  // Optional: update selected if value prop changes
  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  function getLabelByValue(options, selectedValue) {
    if (Array.isArray(options)) {
      return selectedValue || "Select";
    } else {
      const entry = Object.entries(options).find(
        ([label, val]) => val === selectedValue
      );
      return entry ? entry[0] : "Select Value";
    }
  }

  const handleSelect = (val) => {
    setSelected(val);
    if (onChange) onChange(val);
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        bg={inputBg}
        color={textColor}
        borderRadius="lg"
        overflow="hidden"
        border="2px"
        borderColor={useColorModeValue("gray.300", "navy.600")}
        _hover={{ bg: hoverBg }}
        _focus={{
          outline: "none",
          borderColor: focusBorderColor,
          boxShadow: `0 0 0 1px ${focusBorderColor}`,
        }}
        size="sm"
        width={width || "100%"}
        textAlign="left"
      >
        {getLabelByValue(options, selected)}
      </MenuButton>
      <MenuList
        borderRadius="lg"
        fontSize="14px"
        p="2"
        bg={inputBg}
        color={textColor}
        boxShadow={
          "rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;"
        }
      >
        {Array.isArray(options)
          ? options.map((opt) => (
              <MenuItem
                key={opt}
                onClick={() => handleSelect(opt)}
                _hover={{ bg: hoverBg }}
                // borderRadius="md"
                bg={inputBg}
                fontWeight={500}
                my={2}
              >
                {opt}
              </MenuItem>
            ))
          : Object.entries(options).map(([label, value]) => (
              <MenuItem
                key={value}
                bg={inputBg}
                onClick={() => handleSelect(value)}
                _hover={{ bg: hoverBg }}
                // borderRadius="md"
                fontWeight={500}
                my={2}
              >
                {label}
              </MenuItem>
            ))}
      </MenuList>
    </Menu>
  );
};

export default InterfaceSelect;
