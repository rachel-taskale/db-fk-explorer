import { Tooltip } from "@/components/ui/tooltip";
import { Heading } from "@chakra-ui/react";
import { Handle, NodeProps } from "@xyflow/react";

const primaryText = "#F7FAFC";
const secondaryText = "#444be5";
const backgroundColor = "#141414";

const nodeWidth = 172;
const nodeHeight = 36;

export const TableNode: React.FC<NodeProps> = ({ data }) => {
  console.log(data);
  return (
    <span>
      <div
        style={{
          fontSize: 8,
          padding: "10px 10px 10px 8px",
          border: "1px solid #ccc",
          borderRadius: 6,
          backgroundColor: "#191919", // or use secondaryText if defined
          color: primaryText,
          width: 172,
          height: 70,
          overflow: "scroll",
        }}
      >
        <Heading size="md">{data.name}</Heading>
        <div style={{ overflow: "scroll", maxHeight: "8vh" }}>
          <ul
            style={{
              listStyle: "bullet",
              paddingLeft: 0,
              color: "#CACBF9",
            }}
          >
            {data.fields.map((field: string, index: number) => (
              <li key={index}>
                {field}
                <Handle type="target" position="top" id={`${field}-target`} />
                <Handle type="source" position="right" id={`${field}-source`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </span>
  );
};
