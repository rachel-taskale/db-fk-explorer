import { FieldSchema, nodePositions, position } from "@/common/interfaces";
import {
  primaryText,
  primaryText_100,
  primaryText_200,
  secondaryText,
} from "@/common/styles";
import { Box, Stack } from "@chakra-ui/react";
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
        maxHeight: 350,
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
        <Stack divideY="1px" divideColor={primaryText_200} width="100%">
          {Object.entries(data.fields as Record<string, FieldSchema>).map(
            ([key, value]: [string, FieldSchema], index) => (
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
                <div>{key}</div>
                <div
                  style={{
                    color: secondaryText,
                    flexWrap: "wrap",
                    maxWidth: "50%",
                    textAlign: "right",
                  }}
                >
                  {value.type}
                </div>

                <Handle
                  type="target"
                  position={data["targetPosition"]}
                  id={`${key}-target`}
                />

                <Handle
                  type="source"
                  position={data["sourcePosition"]}
                  id={`${key}-source`}
                />
              </div>
            ),
          )}
        </Stack>
      </ul>
    </div>
  );
}
