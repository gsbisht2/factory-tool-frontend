import React, { useState, useEffect } from "react";
import { Icon } from "@chakra-ui/react";
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Card from "../Card/Card";
import { FaCaretSquareDown, FaCaretSquareUp } from "react-icons/fa";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function ComplexTable(props) {
  const {
    tableData,
    columnsData,
    loading = false,
    fetchAllDevices,
    hasNext,
    currentPage = 0,
    totalCount = 0,
    pageCount = 1,
    title = "All Devices",
    showRowsPerPageSelect = false,
    localPagination = false, // <-- NEW PROP
  } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const bg = useColorModeValue("whiteAlpha.200", "navy.600");

  const [data, setData] = useState(() => [...tableData]);
  const [columns, setColumns] = useState(() => [...columnsData]);
  const [sorting, setSorting] = useState([]);
  const [serialNumber, setSerialNumber] = useState("");
  const [pageSize, setPageSize] = useState(9);
  const [pageNumber, setPageNumber] = useState(currentPage);

  // For local pagination
  const [localPageCount, setLocalPageCount] = useState(1);

  useEffect(() => {
    if (tableData && Array.isArray(tableData)) {
      setData(tableData);
      if (localPagination) {
        setLocalPageCount(Math.max(1, Math.ceil(tableData.length / pageSize)));
      }
    }
  }, [tableData, pageSize, localPagination]);

  useEffect(() => {
    if (!localPagination && fetchAllDevices) {
      fetchAllDevices(serialNumber, false);
    }
  }, [serialNumber, fetchAllDevices, localPagination]);

  // Sync page number with parent component
  useEffect(() => {
    setPageNumber(currentPage);
  }, [currentPage]);

  // Update table pagination when pageSize changes
  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);

  // Optionally, reset page number when pageSize changes
  useEffect(() => {
    setPageNumber(0);
    if (!localPagination && fetchAllDevices) {
      fetchAllDevices(serialNumber, false, 0, pageSize);
    }
  }, [pageSize, fetchAllDevices, serialNumber, localPagination]);

  // Pagination handlers
  const getNext = () => {
    const newNumber = pageNumber + 1;
    setPageNumber(newNumber);
    if (!localPagination && fetchAllDevices) {
      fetchAllDevices(serialNumber, false, newNumber, pageSize);
    }
  };

  const getPrevious = () => {
    const newNumber = pageNumber - 1;
    if (pageNumber > 0) {
      setPageNumber(newNumber);
      if (!localPagination && fetchAllDevices) {
        fetchAllDevices(serialNumber, false, newNumber, pageSize);
      }
    }
  };

  useEffect(() => {
    if (columnsData && Array.isArray(columnsData)) {
      setColumns(columnsData);
    }
  }, [columnsData]);

  // Local pagination: slice data for current page
  const paginatedData = localPagination
    ? data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
    : data;

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
  });

  const skeletonRows = pageSize;

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

        <InputGroup
          width={{ base: "100%", md: "400px" }}
          bg={bg}
          borderRadius="1rem"
        >
          <InputLeftElement>
            <SearchIcon borderRadius="2rem" color="navy.500" />
          </InputLeftElement>
          <Input
            borderRadius="1rem"
            border="2px lightgray solid"
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            color={textColor}
            placeholder="Search..."
            outline="none"
            _focus={{ boxShadow: "none" }}
          />
        </InputGroup>
      </Flex>

      <Box overflowX="auto" px="25px">
        <Table
          variant="simple"
          color="gray.500"
          mb="24px"
          mt="12px"
          minW="600px"
        >
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe="10px"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={header.column.getToggleSortingHandler()}
                    minW="120px"
                  >
                    <Flex
                      justifyContent="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <Icon as={FaCaretSquareUp} color="gray.500" />,
                        desc: <Icon as={FaCaretSquareDown} color="gray.500" />,
                      }[header.column.getIsSorted()] ?? null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <Tr key={`skeleton-${i}`}>
                  {columns.map((col, idx) => (
                    <Td
                      key={idx}
                      fontSize={{ sm: "14px" }}
                      minW="120px"
                      borderColor="transparent"
                    >
                      <Skeleton height="20px" />
                    </Td>
                  ))}
                </Tr>
              ))
            ) : paginatedData.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} textAlign="center" py={8}>
                  <Text color="gray.400" fontSize="lg">
                    No data found
                  </Text>
                </Td>
              </Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize={{ sm: "14px" }}
                      minW="120px"
                      borderColor="transparent"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      {/* Pagination Controls */}
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
          onClick={() => getPrevious()}
          isDisabled={pageNumber === 0}
          minW="80px"
        >
          <ChevronLeftIcon />
        </Button>
        <Flex align="center" gap={4}>
          <Text fontSize={{ base: "sm", md: "md" }}>
            Page {pageNumber + 1} of{" "}
            {localPagination ? localPageCount : pageCount}
          </Text>
          {showRowsPerPageSelect && (
            <Flex align="center" gap={2}>
              <Text fontSize={{ base: "sm", md: "md" }}>Rows per page:</Text>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "inherit",
                  background: useColorModeValue("#fff", "#2D3748"),
                  color: useColorModeValue("#2D3748", "#fff"),
                }}
              >
                {[5, 9, 15, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </Flex>
          )}
        </Flex>
        <Button
          size={{ base: "sm", md: "md" }}
          onClick={() => getNext()}
          isDisabled={
            localPagination ? pageNumber + 1 >= localPageCount : !hasNext
          }
          minW="80px"
        >
          <ChevronRightIcon />
        </Button>
      </Flex>
    </Card>
  );
}
