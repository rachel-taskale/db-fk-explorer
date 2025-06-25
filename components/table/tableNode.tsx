import { nodePositions, position } from "@/common/interfaces";
import { primaryText, secondaryText } from "@/common/styles";
import { Handle, NodeProps } from "@xyflow/react";

export function TableNode({ data }: NodeProps<TableNodeData>) {
  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid #d0d7de",
        borderRadius: "8px",
        background: "#1d1f26",
        color: primaryText,
        width: 300,
        height: 350,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.5 rem",
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
          maxHeight: 250,
          overflow: "scroll",
        }}
      >
        {data.fields.map((field, index) => (
          <div
            key={index}
            style={{
              fontSize: "1rem",
              padding: "4px 0 4px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: primaryText,
            }}
          >
            <div>{field}</div>
            <div style={{ color: secondaryText }}>type</div>

            <Handle
              type="target"
              position={data["targetPosition"]}
              id={`${field}-target`}
            />

            <Handle
              type="source"
              position={data["sourcePosition"]}
              id={`${field}-source`}
            />
          </div>
        ))}
      </ul>
    </div>
  );
}
