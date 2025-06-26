// pages/table/[id].tsx
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Spinner,
  Table,
  Container,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { CgSearch } from "react-icons/cg";
import { primaryText, primaryText_200 } from "@/common/styles";

interface Field {
  name: string;
  // ... other props
}

export default function TableDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tableData, setTableData] = useState<any[]>([]);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/table/${id}`);
      const data = await res.json();
      setTableData(data.rows || []);
      if (data.fields) {
        setColumnNames(data.fields.map((item: Field) => item.name));
      }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

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
  const borderColor = primaryText_200;
  return (
    <Box p={8}>
      <Flex justify="space-between" mb={4} align="center">
        <Flex align="center" gap={3}>
          <IconButton
            aria-label="Go back"
            variant="ghost"
            onClick={() => router.back()}
          >
            <GoArrowLeft />
          </IconButton>
          <Heading size="lg">Table: {id}</Heading>
        </Flex>
      </Flex>

      <Container
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        overflow="scroll"
      >
        <Table.Root variant="striped" colorScheme="gray" size="md">
          <Table.Header>
            <Table.Row>
              {columnNames.map((col) => (
                <Table.ColumnHeader
                  key={col}
                  fontSize="xs"
                  textTransform="uppercase"
                  fontWeight="bold"
                  color="gray.500"
                  borderColor={borderColor}
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
                    borderColor={borderColor}
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
    </Box>
  );
}
