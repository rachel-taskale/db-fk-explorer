// components/CustomEdge.tsx
import { Tooltip } from "@chakra-ui/react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";
import { useState, useEffect } from "react";

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isHovered ? "white" : "#888",
          strokeWidth: 2,
          pointerEvents: "stroke",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {isHovered && (
        <EdgeLabelRenderer>
          <Tooltip content={data?.label || "FK info"} />
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
