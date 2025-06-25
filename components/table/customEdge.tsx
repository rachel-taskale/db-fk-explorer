import { primaryText } from "../../common/styles";
import {
  EdgeLabelRenderer,
  getBezierPath,
  getEdgeCenter,
  getSmoothStepPath,
  getStraightPath,
} from "@xyflow/react";

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
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // ✅ Calculate center of the edge
  const [labelX, labelY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* Invisible fat path for easier hover/click */}
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={40}
        fill="none"
        style={{ pointerEvents: "stroke", zIndex: 1000 }}
      />

      {/* Actual visible edge */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        style={{ ...style, strokeLinecap: "round" }}
        markerEnd={markerEnd}
      />

      {/* Midpoint label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            zIndex: 1000, // ⬅️ bring label on top of nodes
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            fontSize: 10,
            background: "#1a1a1a",
            color: primaryText,
            padding: "1px 6px",
            borderRadius: 4,
            border: "1px solid white",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {data["label"]}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
