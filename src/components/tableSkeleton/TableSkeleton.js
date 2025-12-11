import {
  Box,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";

const TableSkeleton = ({ tableCount = 4, rowCount = 4, columnCount = 10 }) => {
  const skeletonBg = useColorModeValue("navy.50", "navy.100");

  return (
    <Box>
      {/* Heading Skeleton */}
      <Skeleton height="40px" width="250px" mb={6} />

      {/* Table Skeletons */}
      <Box overflowX="auto">
        {[...Array(tableCount)].map((_, tableIdx) => (
          <Card key={tableIdx} mb={8}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {[...Array(columnCount)].map((_, idx) => (
                    <Th key={idx}>
                      <Skeleton
                        height="20px"
                        width="80px"
                        startColor={skeletonBg}
                        endColor="gray.800"
                      />
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {[...Array(rowCount)].map((_, rowIdx) => (
                  <Tr key={rowIdx}>
                    {[...Array(columnCount)].map((_, colIdx) => (
                      <Td key={colIdx}>
                        <Skeleton
                          height="20px"
                          width="100%"
                          startColor={skeletonBg}
                          endColor="gray.800"
                        />
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TableSkeleton;
