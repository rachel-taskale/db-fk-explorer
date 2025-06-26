import { useMemo, useCallback, useEffect } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import {
  useReactFlow,
  ReactFlow,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useRouter } from "next/router";
import {
  FKBucket,
  TableMappingClassification,
  TableSchema,
} from "../../common/interfaces";
import { TableNode } from "./tableNode";
import { TableEdge } from "./tableEdge";
import { Box, Button } from "@chakra-ui/react";
import { primaryText, secondaryText } from "@/common/styles";
import { CrowFootNotation } from "@/assets/CrowFootNotation";

interface TableFlowProps {
  tableData: TableSchema[];
  classifiedData: Record<string, FKBucket>;
}

// First, define custom SVG markers for crow's foot notation

const elk = new ELK();

const nodeWidth = 300;
const nodeHeight = 350;

const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  direction: "RIGHT" | "DOWN" | "UP" | "LEFT",
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const elkOptions = {
    "elk.algorithm": "layered",
    "elk.direction": direction,
    "elk.layered.spacing.nodeNodeBetweenLayers": "100",
    "elk.spacing.nodeNode": "100",
    "elk.spacing.edgeNode": "50",
    "elk.spacing.edgeEdge": "100",
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    "elk.layered.edgeRouting": "ORTHOGONAL",
  };
  const elkNodes = nodes.map((node) => ({
    id: node.id,
    width: nodeWidth,
    height: nodeHeight,
  }));

  const elkEdges = edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  const layoutGraph = {
    id: "root",
    layoutOptions: {
      ...elkOptions,
      "elk.direction": direction,
    },
    children: elkNodes,
    edges: elkEdges,
  };

  function getPortPositions(direction: string) {
    switch (direction) {
      case "RIGHT":
        return { sourcePosition: "right", targetPosition: "left" };
      case "LEFT":
        return { sourcePosition: "left", targetPosition: "right" };
      case "UP":
        return { sourcePosition: "top", targetPosition: "bottom" };
      case "DOWN":
      default:
        return { sourcePosition: "bottom", targetPosition: "top" };
    }
  }
  const layout = await elk.layout(layoutGraph);
  const { sourcePosition, targetPosition } = getPortPositions(direction);
  const positionedNodes = nodes.map((node) => {
    const layoutNode = layout.children?.find((n) => n.id === node.id);
    // Get all the fields in our classfied list that have connections

    // now go thru all the nodes we've generated and create a list of all them and their positions for comparison
    // to determine which side to put the node on

    return {
      ...node,
      position: {
        x: layoutNode?.x ?? 0,
        y: layoutNode?.y ?? 0,
      },
      targetPosition,
      sourcePosition,
    };
  });

  return { nodes: positionedNodes, edges: edges };
};

export const TableFlow: React.FC<TableFlowProps> = ({
  tableData,
  classifiedData,
}) => {
  const router = useRouter();
  const nodeTypes = { tableNode: TableNode };
  const direction = "RIGHT";

  const getMarkerTypes = (classification: TableMappingClassification) => {
    switch (classification) {
      case TableMappingClassification.OneToMany:
        return {
          markerStart: "url(#one)",
          markerEnd: "url(#many)",
        };
      case TableMappingClassification.ManyToOne:
        return {
          markerStart: "url(#many)",
          markerEnd: "url(#one)",
        };
      case TableMappingClassification.OneToOne:
        return {
          markerStart: "url(#one)",
          markerEnd: "url(#one)",
        };
      case TableMappingClassification.ManyToMany:
        return {
          markerStart: "url(#many)",
          markerEnd: "url(#many)",
        };
      default:
        return {
          markerStart: undefined,
          markerEnd: "url(#many)", // default fallback
        };
    }
  };

  const baseNodes: Node[] = useMemo(() => {
    if (!Array.isArray(tableData)) return [];

    return tableData.map((table) => ({
      id: table.tableName,
      type: "tableNode",
      position: { x: 0, y: 0 },
      data: {
        name: table.tableName,
        fields: table.fields,
      },
    }));
  }, [tableData]);

  const baseEdges: Edge[] = useMemo(() => {
    if (!classifiedData || typeof classifiedData !== "object") return [];

    return Object.entries(classifiedData).flatMap(([key, FKBucket]) => {
      const classification = FKBucket.classification;
      const markers = getMarkerTypes(classification);
      const splitKey = key.split("#"); // [fromTable, fromColumn]

      return FKBucket.references.map((fk) => {
        const splitFK = fk.split("#"); // [toTable, toColumn]

        return {
          id: `${key}-${fk}`,
          source: splitKey[0],
          sourceHandle: `${splitKey[1]}-source`,
          target: splitFK[0],
          targetHandle: `${splitFK[1]}-target`,
          type: "custom",
          data: {
            label: `${splitKey[0]}.${splitKey[1]} → ${splitFK[0]}.${splitFK[1]}`,
            classifiedConnection: classifiedData[key].classification,
          },
          style: {
            stroke: primaryText,
            strokeWidth: 1.4,
            color: primaryText,
            markerStart: markers.markerStart,
            markerEnd: markers.markerEnd,
          },
        };
      });
    });
  }, [classifiedData, secondaryText]);

  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges);
  useEffect(() => {
    const layoutFlow = async () => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await getLayoutedElements(baseNodes, baseEdges, direction);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    };

    layoutFlow();
  }, [baseNodes, baseEdges]);

  const edgeTypes = useMemo(
    () => ({
      custom: TableEdge,
    }),
    [],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      router.push(`/table/${node.id}`);
    },
    [router],
  );
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <Box position="relative" width="100%" height="100%">
      <CrowFootNotation />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        fitView
        connectionMode={ConnectionMode.Strict}
        nodesDraggable={false}
        zoomOnScroll={true}
        panOnScroll={false}
        panOnDrag={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        style={{ border: "none" }}
      >
        <Background />
      </ReactFlow>

      <Box
        position="absolute"
        bottom="20px"
        right="20px"
        zIndex="100"
        display="flex"
        gap={2}
      >
        <Button size="md" onClick={() => zoomOut()} variant="outline">
          −
        </Button>
        <Button size="md" onClick={() => zoomIn()} variant="outline">
          +
        </Button>
        <Button size="md" onClick={() => fitView()} variant="outline">
          Reset
        </Button>
      </Box>
    </Box>
  );
};
