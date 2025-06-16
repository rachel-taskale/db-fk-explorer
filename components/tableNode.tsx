import { Tooltip } from "@/components/ui/tooltip";
import { Heading } from "@chakra-ui/react";
import { Handle, NodeProps } from "@xyflow/react";

const primaryText = "#F7FAFC";
const secondaryText = "#444be5";
const backgroundColor = "#141414";

export const TableNode: React.FC<NodeProps> = ({ data }) => {
  console.log(data);
  return (
    <div
      style={{
        fontSize: 8,
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 6,
        backgroundColor: primaryText, // or use secondaryText if defined
        color: backgroundColor,
        width: "10rem",
        maxHeight: "20rem",
      }}
    >
      <Heading size="md">{data.name}</Heading>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {data.fields.map((field: string, index: number) => (
          <li key={index}>
            {field}
            <Handle type="target" position="left" id={`${field}-target`} />
            <Handle type="source" position="right" id={`${field}-source`} />
          </li>
        ))}
      </ul>
    </div>
  );
};
