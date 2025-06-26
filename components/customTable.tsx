import {
  background,
  backgroundColor,
  primaryText,
  primaryText_500,
  secondaryText,
  sidebarNav,
} from "@/common/styles";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react";
import router from "next/router";
import { useEffect, useState } from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

interface CustomTableProps {
  id: string | string[];
  size: "sm" | "md" | "lg";
  paginationIncrement: number;
  borderColor: string;
  width: number;
  isRelatedTable: boolean;
}

export const CustomTable = (props: CustomTableProps) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = props.paginationIncrement;
  const totalPages = Math.ceil(tableData.length / pageSize);
  const paginatedData = tableData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/table/${props.id}`);
      const data = await res.json();
      setTableData(data.data || []);
      if (data.fields) {
        setColumnNames(data.fields.map((item: Field) => item.name));
      }
      setLoading(false);
    };
    if (props.id) fetchData();
  }, [props.id]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (tableData.length === 0) {
    return (
      <Box p={8}>
        <Heading size="md">No data found</Heading>
      </Box>
    );
  }

  return (
    <Box width={props.width}>
      <Container
        border="1px solid"
        borderColor={props.borderColor}
        borderRadius="md"
        overflow="scroll"
      >
        <Table.Root variant="striped" size={props.size}>
          <Table.Header>
            <Table.Row>
              {columnNames.map((col) => (
                <Table.ColumnHeader
                  key={col}
                  fontSize="xs"
                  textTransform="uppercase"
                  fontWeight="bold"
                  color={primaryText_500}
                  borderColor={props.borderColor}
                >
                  {col}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedData.map((row, idx) => (
              <Table.Row key={idx}>
                {columnNames.map((col) => (
                  <Table.Cell
                    key={col}
                    fontFamily="mono"
                    fontSize="sm"
                    borderColor={props.borderColor}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {row[col]?.toString() || ""}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        {props.isRelatedTable && (
          <Flex alignContent="end" justifyContent="end">
            <Button
              bg={background}
              color={secondaryText}
              onClick={() => router.push(`/table/${props.id}`)}
            >
              More data
              <GoArrowRight />
            </Button>
          </Flex>
        )}
      </Container>

      {/* Pagination Controls */}
      <Box width="100%" p={2}>
        <Flex justify="space-between" align="center" width="100%">
          {/* Empty left spacer to balance center alignment */}
          <Box width="40px" />

          {/* Centered Page Info */}
          <Box>
            <Text fontSize="sm" textAlign="center">
              Page {currentPage + 1} of {totalPages}
            </Text>
          </Box>

          {/* Right-aligned arrows */}
          <Flex gap={2}>
            <Button
              bg="#101217"
              color={primaryText}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              isDisabled={currentPage === 0}
              size="sm"
            >
              <BiLeftArrow />
            </Button>
            <Button
              bg="#101217"
              color={primaryText}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              isDisabled={currentPage >= totalPages - 1}
              size="sm"
            >
              <BiRightArrow />
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
