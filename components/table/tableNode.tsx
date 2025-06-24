import { primaryText } from "@/common/styles";
import { Handle } from "@xyflow/react";

export function TableNode({ data }: NodeProps<TableNodeData>) {
  return (
    <div
      style={{
        padding: ".85rem",
        border: "1px solid #d0d7de",
        borderRadius: "8px",
        background: "#1d1f26",
        color: primaryText,
        width: 240,
        // maxHeight: 400,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.25 rem",
          marginBottom: "1rem",
        }}
      >
        {data.name}
      </div>
      <ul
        style={{
          listStyle: "none",
          paddingLeft: 0,
          margin: 0,
          maxHeight: 300,
          overflow: "scroll",
        }}
      >
        {data.fields.map((field, index) => (
          <div
            key={index}
            style={{
              fontSize: ".9rem",
              padding: "4px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: primaryText,
            }}
          >
            <td>{field}</td>
            <td>type</td>
            <Handle
              type="target"
              position="left"
              id={`${field}-target`}
              style={{ top: "50%", transform: "translateY(-50%)" }}
            />
            <Handle
              type="source"
              position="right"
              id={`${field}-source`}
              style={{ top: "50%", transform: "translateY(-50%)" }}
            />
          </div>
        ))}
      </ul>
    </div>
  );
}
