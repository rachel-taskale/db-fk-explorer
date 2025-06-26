// pages/homepage.tsx
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { TableSchema } from "@/common/interfaces";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { TableFlow } from "@/components/table/tableFlow";
import { ReactFlowProvider } from "@xyflow/react";

export default function Homepage() {
  const [tableData, setTableData] = useState<TableSchema[]>([]);
  const [classifiedData, setClassifiedData] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/table");
      console.log(res);
      setTableData(res.data["tableData"]);
      setClassifiedData(res.data["classifiedData"]);
    };
    fetch();
  }, []);
  console.log(tableData);

  if (!tableData || tableData.length === 0) {
    return (
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
    );
  }

  return (
    <ReactFlowProvider>
      <Box p={4} height="100vh">
        <TableFlow tableData={tableData} classifiedData={classifiedData} />
      </Box>
    </ReactFlowProvider>
  );
}
