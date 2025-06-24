import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  VStack,
  Text,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { TableSchema } from "@/common/interfaces";
import { TableFlow } from "../components/table/tableFlow";
import { backgroundColor } from "@/common/styles";
import { ReactFlowProvider } from "@xyflow/react";
import api from "@/lib/axios";

export default function Home() {
  const [tableData, setTableData] = useState<TableSchema[]>([]);
  const [classifiedData, setAllClassifiedData] = useState({});
  const [dbURI, setDbURI] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const retreiveNodeData = async () => {
    try {
      const result = await api.get("/table");
      setTableData(result.data["tableData"]);
      setAllClassifiedData(result.data["classifiedData"]);
    } catch (err) {
      console.error("Failed to set dbURI:", err);
      setError("Failed to connect. Please check your URI.");
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/session/set-dburi", { dbURI });
      retreiveNodeData();
    } catch (err: any) {
      console.error("Failed to set dbURI:", err);
      setError("Failed to connect. Please check your URI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retreiveNodeData();
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

          <Box width="100%">
            <Text mb={1} fontSize="sm" color="gray.400">
              Database URI
            </Text>
            <Input
              placeholder="e.g. postgresql://..."
              value={dbURI}
              onChange={(e) => setDbURI(e.target.value)}
              size="sm"
              variant="filled"
              bg="#2a2d34"
              color="#f5f6fa"
              _hover={{ bg: "#32363f" }}
              _focus={{
                borderColor: "#635bff",
                boxShadow: "0 0 0 1px #635bff",
              }}
            />
          </Box>

          <Button
            width="100%"
            size="sm"
            bg="#635bff"
            color="white"
            fontWeight="medium"
            _hover={{ bg: "#7a6fff" }}
            onClick={onSubmit}
          >
            Generate Schema
          </Button>
          {tableData && (
            <div>
              {tableData.map((item) => (
                <ul style={{ opacity: ".6", padding: "10px 0px 10px  0px" }}>
                  <Link key={item.tableName} href={`/table/${item.tableName}`}>
                    <div style={{ cursor: "pointer" }}>{item.tableName}</div>
                  </Link>
                </ul>
              ))}
              <Text></Text>
            </div>
          )}
        </VStack>

        <Text fontSize="xs" color="gray.600" mt={10}>
          © 2025 SchemaApp Inc.
        </Text>
      </Box>

      {/* Main Area */}
      <Box flex="1" bg="#0f1117">
        {tableData ? (
          <ReactFlowProvider>
            <TableFlow tableData={tableData} classifiedData={classifiedData} />
          </ReactFlowProvider>
        ) : (
          <Flex align="center" justify="center" height="100%">
            <VStack spacing={2}>
              <Heading size="md" color="gray.500">
                Connect to your database
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Visualize schema relationships
              </Text>
            </VStack>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
