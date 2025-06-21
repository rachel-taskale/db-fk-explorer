// TableNode.jsx
import { Handle } from "@xyflow/react";

export function TableNode({ data }) {
  return (
    <div
      style={{
        padding: 8,
        border: "1px solid #ccc",
        borderRadius: 6,
        background: "white",
        color: "black",
      }}
    >
      <strong>{data.name}</strong>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {data.fields.map((field, index) => (
          <li key={index}>
            {field}
            {/* Input handle for foreign keys */}
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
