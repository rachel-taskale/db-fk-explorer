import { primaryText } from "../../common/styles";
import { Heading } from "@chakra-ui/react";
import {
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from "@xyflow/react";
import { useState } from "react";

type CustomHoverEdgeProps = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  style?: React.CSSProperties;
  markerEnd?: string;
  data?: Record<string, string>;
};

export const CustomHoverEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
}: CustomHoverEdgeProps) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={40}
        fill="none"
        style={{ pointerEvents: "stroke" }}
      />

      <path
        id={id}
        d={edgePath}
        fill="none"
        style={style}
        markerEnd={markerEnd}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${sourceX}px, ${sourceY}px)`,
            fontSize: 10,
            background: "#1a1a1a",
            color: primaryText,
            padding: "1px 6px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {data?.fromField}
        </div>
      </EdgeLabelRenderer>
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${targetX}px, ${targetY}px)`,
            fontSize: 10,
            background: "#1a1a1a",
            color: primaryText,
            padding: "1px 6px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {data?.toField}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
