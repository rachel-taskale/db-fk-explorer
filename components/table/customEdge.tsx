import { primaryText, secondaryText } from "@/common/styles";
import { Heading } from "@chakra-ui/react";
import { EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { useState } from "react";

const CustomHoverEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
  data,
}: EdgeProps) => {
  const [hovered, setHovered] = useState(false);

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const strokeWidth = hovered ? 4 : style?.strokeWidth || 1.5;

  return (
    <>
      {/* Transparent hover buffer path */}
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={40}
        fill="none"
        style={{ pointerEvents: "stroke" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Actual visible path (re-renders to top when hovered) */}
      {hovered ? null : (
        <path
          id={id}
          d={edgePath}
          stroke={hovered ? secondaryText : "#555"}
          strokeWidth={strokeWidth}
          fill="none"
          style={style}
          markerEnd={markerEnd}
        />
      )}

      {hovered && (
        <path
          id={id}
          d={edgePath}
          stroke={secondaryText}
          strokeWidth={strokeWidth}
          fill="none"
          style={{
            ...style,
            zIndex: 9999, // ⬅️ render last = appears on top
          }}
          markerEnd={markerEnd}
        />
      )}

      {data?.label && hovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${
                (sourceX + targetX) / 2
              }px, ${(sourceY + targetY) / 2}px)`,
              fontSize: 10,
              padding: "2px 4px",
              background: "#fff",
              border: `2px solid ${secondaryText}`,
              borderRadius: 4,
              color: "#000",
              maxWidth: "20vw",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            <Heading size="sm">{data.label}</Heading>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomHoverEdge;
