// components/Layout.tsx
import { Box, Flex, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TableSchema } from "@/common/interfaces";
import { DBURIInput } from "./dbURIInput";
import api from "@/lib/axios";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [tableData, setTableData] = useState<TableSchema[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.get("/table");
        setTableData(result.data["tableData"]);
      } catch {}
    };
    fetchData();
  }, []);

  return (
    <Flex
      height="100vh"
      bg="#0f1117"
      color="#f5f6fa"
      fontFamily="system-ui, sans-serif"
    >
      {/* Sidebar */}
      <Box
        width="300px"
        bg="#1c1f26"
        borderRight="1px solid #2a2d34"
        p={6}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <VStack align="start" spacing={6}>
          <Heading size="md" color="#f5f6fa">
            Schema Explorer
          </Heading>

          <DBURIInput />

          {tableData && (
            <div>
              {tableData.map((item) => (
                <ul
                  key={item.tableName}
                  style={{ opacity: ".5", padding: "10px 0px" }}
                >
                  <Link href={`/table/${item.tableName}`}>
                    <div style={{ cursor: "pointer" }}>{item.tableName}</div>
                  </Link>
                </ul>
              ))}
            </div>
          )}
        </VStack>

        <Text fontSize="xs" color="gray.600" mt={10}>
          © 2025 SchemaApp Inc.
        </Text>
      </Box>

      {/* Main Content */}
      <Box flex="1" overflow="auto">
        {children}
      </Box>
    </Flex>
  );
}
