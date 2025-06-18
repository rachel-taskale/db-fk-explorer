import { primaryText } from "@/common/styles";
import { Box, Heading } from "@chakra-ui/react";
import { Handle, NodeProps } from "@xyflow/react";

export const TableNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <Box
      fontSize="8px"
      p="4"
      border={`1px solid ${primaryText}`}
      bg="#1a1a1a"
      color="black"
      maxH={170}
      borderRadius="md"
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{
        // transform: "scale(1.02)",
        boxShadow: "0 0 0 4px #444be520",
        border: "1px solid #444be5",
        // zIndex: 10,
      }}
    >
      <Heading size="lg" mb={2} color={primaryText} fontWeight="bolder">
        {data.name}
      </Heading>
      <Box maxH="8vh" overflowY="auto" fontSize="sm">
        <ul style={{ listStyle: "bullet", paddingLeft: 0, color: "#CACBF9" }}>
          {data.fields.map((field: string, index: number) => (
            <li key={index}>
              {field}
              <Handle type="target" position="top" id={`${field}-target`} />
              <Handle type="source" position="right" id={`${field}-source`} />
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};
