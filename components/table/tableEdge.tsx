import { TableMappingClassification } from "@/common/interfaces";
import { primaryText, secondaryText_400 } from "../../common/styles";
import { EdgeLabelRenderer, getBezierPath, getEdgeCenter } from "@xyflow/react";

type TableEdgeProps = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  style?: React.CSSProperties;
  markerEnd?: string;
  data?: Record<string, string>;
};

export const TableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
}: TableEdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [labelX, labelY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const strokeColor =
    data && data["classifiedConnection"] === TableMappingClassification.OneToOne
      ? primaryText
      : secondaryText_400;
  return (
    <>
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={40}
        fill="none"
        style={{ pointerEvents: "stroke", zIndex: 1000 }}
      />

      <path
        id={id}
        d={edgePath}
        fill="none"
        style={{ ...style, stroke: strokeColor, strokeLinecap: "round" }}
        markerEnd={markerEnd}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
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
