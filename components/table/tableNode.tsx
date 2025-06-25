import { primaryText, secondaryText } from "@/common/styles";
import { Handle, NodeProps } from "@xyflow/react";

export function TableNode({ data }: NodeProps<TableNodeData>) {
  const determineClosestNodeSide = (field, connections) => {
    // We need the point that we have a connection with
    // If one node is more on the left than on the right then we need to determine the side
    //
    // console.log(field);
    // console.log(connections);
  };

  const positions = data.fields.map((item) => {
    // console.log(data.classifiedConnections);
    if (data.classifiedConnections) {
      determineClosestNodeSide(item, data.classifiedConnections);
    }
  });

  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid #d0d7de",
        borderRadius: "8px",
        background: "#1d1f26",
        color: primaryText,
        width: 240,
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
          maxHeight: 300,
          overflow: "scroll",
        }}
      >
        {data.fields.map((field, index) => (
          <div
            key={index}
            style={{
              fontSize: "1rem",
              padding: "4px 0",
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
