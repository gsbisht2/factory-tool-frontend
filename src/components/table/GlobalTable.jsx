import React, { useState, useMemo, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Button,
  Box,
  Skeleton,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

import Card from "../Card/Card";
import { SearchBar } from "../searchBar/SearchBar";
import InterfaceSelect from "../select"; // Add this import

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

const GlobalTable = React.memo(
  ({
    columns,
    data,
    tableProps = {},
    emptyText = "No data found.",
    isLoading = false,
    searchText,
    setSearchText,
    showSearchBar = false,
    searchBarProps = {},
    // Add pagination props
    page: externalPage,
    setPage: externalSetPage,
    pageCount: externalPageCount,
    nextPageUrl,
    prevPageUrl,
    title = "Table", // Add title prop for consistency
    rowsPerPage: externalRowsPerPage, // <-- Add this prop
    setRowsPerPage: externalSetRowsPerPage, // <-- Add this prop (optional)
  }) => {
    // Use internal state only if external props are not provided
    const [internalPage, setInternalPage] = useState(1);
    const [internalRowsPerPage, setInternalRowsPerPage] = useState(5);

    const rowsPerPage = externalRowsPerPage ?? internalRowsPerPage;
    const setRowsPerPage = externalSetRowsPerPage ?? setInternalRowsPerPage;

    const page = externalPage ?? internalPage;
    const setPage = externalSetPage ?? setInternalPage;
    const pageCount =
      externalPageCount ?? (Math.ceil(data.length / rowsPerPage) || 1);

    const searchInputRef = useRef(null);
    const wasSearchFocused = useRef(false);

    // Track if search input was focused before re-render
    useEffect(() => {
      if (showSearchBar && searchInputRef.current) {
        if (wasSearchFocused.current) {
          // Restore focus after re-render
          searchInputRef.current.focus();
          wasSearchFocused.current = false;
        }
      }
    });

    // Only slice data if using internal pagination
    const paginatedData = useMemo(
      () =>
        externalPage !== undefined
          ? data // server-side pagination: use data as-is
          : data.slice((page - 1) * rowsPerPage, page * rowsPerPage),
      [data, page, rowsPerPage, externalPage]
    );

    const handleRowsPerPageChange = (val) => {
      setRowsPerPage(Number(val));
      setPage(1);
    };

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(pageCount, p + 1));

    const handleSearchChange = (e) => {
      // Track that search input is focused
      wasSearchFocused.current = document.activeElement === e.target;
      setSearchText(e.target.value);
    };

    const handleSearchFocus = () => {
      wasSearchFocused.current = true;
    };

    const handleSearchBlur = () => {
      wasSearchFocused.current = false;
    };

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const bg = useColorModeValue("whiteAlpha.200", "navy.600");

    return (
      <Card flexDirection="column" w="100%" px="0px" overflowX="hidden">
        <Flex
          px="25px"
          mb="8px"
          justifyContent="space-between"
          align="center"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
        >
          <Text
            color={textColor}
            fontSize={{ base: "18px", md: "22px" }}
            fontWeight="700"
            lineHeight="100%"
            mb={{ base: 2, md: 0 }}
          >
            {title}
          </Text>
          {showSearchBar && (
            <InputGroup
              width={{ base: "100%", md: "400px" }}
              bg={bg}
              borderRadius="1rem"
            >
              <InputLeftElement>
                <SearchIcon borderRadius="2rem" color="navy.500" />
              </InputLeftElement>
              <Input
                ref={searchInputRef}
                borderRadius="1rem"
                border="2px lightgray solid"
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                color={textColor}
                placeholder="Search..."
                outline="none"
                _focus={{ boxShadow: "none" }}
                {...searchBarProps}
              />
            </InputGroup>
          )}
        </Flex>
        <Box overflowX="auto" px="25px">
          <Table
            variant="simple"
            color="gray.500"
            mb="24px"
            mt="12px"
            minW="600px"
            size="md"
            width="100%"
            {...tableProps}
          >
            <Thead>
              <Tr>
                {columns.map((col) => (
                  <Th
                    key={col.label}
                    borderColor={borderColor}
                    cursor="default"
                    minW="120px"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                    pe="10px"
                  >
                    <Flex
                      justifyContent="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {col.label}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                [...Array(4)].map((_, rowIndex) => (
                  <Tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <Td
                        key={colIndex}
                        fontSize={{ sm: "14px" }}
                        minW="120px"
                        borderColor="transparent"
                      >
                        <Skeleton height="20px" />
                      </Td>
                    ))}
                  </Tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <Tr key={idx}>
                    {columns.map((col, i) => (
                      <Td
                        key={i}
                        fontSize={{ sm: "14px" }}
                        minW="120px"
                        borderColor="transparent"
                      >
                        {col.render
                          ? col.render(row)
                          : row[col.label.toLowerCase()]}
                      </Td>
                    ))}
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={columns.length} textAlign="center" py={8}>
                    <Text color="gray.400" fontSize="lg">
                      {emptyText}
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
        {/* Pagination controls */}
        <Flex
          justify="space-between"
          align="center"
          p={4}
          px="25px"
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 2, sm: 0 }}
        >
          <Button
            size={{ base: "sm", md: "md" }}
            border={"none"}
            onClick={handlePrev}
            isDisabled={page === 1}
            minW="80px"
            variant="outline"
            leftIcon={<FaChevronLeft />}
          />
          <Flex align="center" gap={4}>
            <Text fontSize={{ base: "sm", md: "md" }}>
              Page {page} of {pageCount}
            </Text>
            {/* Only show Rows per page if rowsPerPage is controlled via prop */}
            {externalRowsPerPage !== undefined && (
              <Flex align="center" gap={2}>
                <Text fontSize={{ base: "sm", md: "md" }}>Rows per page:</Text>
                {/* Replace native select with InterfaceSelect */}
                <InterfaceSelect
                  value={rowsPerPage}
                  options={ROWS_PER_PAGE_OPTIONS}
                  onChange={handleRowsPerPageChange}
                  width="90px"
                />
              </Flex>
            )}
          </Flex>
          <Button
            size={{ base: "sm", md: "md" }}
            border={"none"}
            onClick={handleNext}
            isDisabled={page === pageCount}
            minW="80px"
            variant="outline"
            rightIcon={<FaChevronRight />}
          />
        </Flex>
      </Card>
    );
  }
);

export default GlobalTable;
