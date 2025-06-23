// TableNode.jsx
import { Handle, NodeProps, Position } from "@xyflow/react";
interface TableNodeData {
  name: string;
  fields: string[];
}
export function TableNode({ data }: NodeProps<TableNodeData>) {
  return (
    <div
      style={{
        padding: 8,
        border: "1px solid #ccc",
        borderRadius: 6,
        background: "white",
        color: "black",
        height: 200,
        width: 200,
      }}
    >
      <strong>{data.name}</strong>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {data.fields.map((field, index) => (
          <li key={index}>
            {field}
            <Handle
              type="target"
              position="left"
              id={`${field}-target`}
              style={{ top: 20 + index * 20 }}
            />
            <Handle
              type="source"
              position="right"
              id={`${field}-source`}
              style={{ top: 20 + index * 20 }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
