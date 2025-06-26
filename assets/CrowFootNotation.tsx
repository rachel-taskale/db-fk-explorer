import {
  secondaryText_300,
  secondaryText_400,
  secondaryText_500,
} from "@/common/styles";

export const CrowFootNotation = () => (
  <svg
    style={{
      position: "absolute",
      width: 0,
      height: 0,
      pointerEvents: "none",
    }}
  >
    <defs>
      {/* Many relationship marker (crow's foot) - REVERSED */}
      <marker
        id="many"
        markerWidth="25"
        markerHeight="25"
        refX="12"
        refY="12"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d="M16,3 L6,12 L16,21 M6,12 L16,12"
          stroke={secondaryText_300}
          strokeWidth="1.5"
          fill="none"
        />
      </marker>

      {/* Optional relationship marker */}
      <marker
        id="optional"
        markerWidth="20"
        markerHeight="20"
        refX="10"
        refY="10"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle
          cx="8"
          cy="10"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </marker>
    </defs>
  </svg>
);
