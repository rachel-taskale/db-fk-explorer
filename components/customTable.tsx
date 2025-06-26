import { primaryText_500 } from "@/common/styles";
import {
  Box,
  Container,
  Flex,
  Heading,
  Spinner,
  Table,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface CustomTableProps {
  id: string | string[];
  size: "sm" | "md" | "lg";
  paginationIncrement: number;
  borderColor: string;
}

export const CustomTable = (props: CustomTableProps) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
    <div>
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
            {tableData.map((row, idx) => (
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
      </Container>
    </div>
  );
};
