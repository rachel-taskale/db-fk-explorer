import { useMemo, useCallback, useEffect } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import {
  ReactFlowProvider,
  useReactFlow,
  ReactFlow,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useRouter } from "next/router";
import {
  fkBucket,
  TableMappingClassification,
  TableSchema,
} from "../../common/interfaces";
import { TableNode } from "./tableNode";
import { CustomHoverEdge } from "./customEdge";
import { redirect } from "next/dist/server/api-utils";
import { Box, Button } from "@chakra-ui/react";

interface TableFlowProps {
  tableData: TableSchema[];
  classifiedData: Record<string, fkBucket>;
}

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

const nodeWidth = 200;
const nodeHeight = 200;

const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  direction: "RIGHT" | "DOWN",
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
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
    layoutOptions: elkOptions,
    children: elkNodes,
    edges: elkEdges,
  };

  const layout = await elk.layout(layoutGraph);

  const positionedNodes = nodes.map((node) => {
    const layoutNode = layout.children?.find((n) => n.id === node.id);
    return {
      ...node,
      position: {
        x: layoutNode?.x ?? 0,
        y: layoutNode?.y ?? 0,
      },
      targetPosition: "top",
      sourcePosition: "bottom",
    };
  });

  return { nodes: positionedNodes, edges: edges };
};

const CalculateClosestNodePosition = () => {};

export const TableFlow: React.FC<TableFlowProps> = ({
  tableData,
  classifiedData,
}) => {
  const router = useRouter();
  const secondaryText = "#444be5";

  const nodeTypes = { tableNode: TableNode };

  const baseNodes: Node[] = useMemo(() => {
    if (!Array.isArray(tableData)) return [];
    const fkFields = new Set<string>();
    Object.values(classifiedData).forEach((bucket) => {
      bucket.references.forEach((fk) => {
        fkFields.add(`${fk.fromTable}.${fk.fromColumn}`);
        fkFields.add(`${fk.toTable}.${fk.toColumn}`);
      });
    });

    return tableData.map((table) => ({
      id: table.tableName,
      type: "tableNode",
      position: { x: 0, y: 0 },
      data: {
        name: table.tableName,
        fields: Object.keys(table.fields),
      },
    }));
  }, [tableData]);

  const classifiedStyling = (
    classification: TableMappingClassification,
  ): string => {
    switch (classification) {
      case TableMappingClassification.ManyToMany:
        return "red";
      case TableMappingClassification.OneToMany:
        return "blue";
      case TableMappingClassification.ManyToOne:
        return "green";
      case TableMappingClassification.OneToOne:
        return "gray";
      default:
        return "#555";
    }
  };
  const baseEdges: Edge[] = useMemo(() => {
    if (!classifiedData || typeof classifiedData !== "object") return [];

    return Object.entries(classifiedData).flatMap(([idx, fkBucket]) => {
      const classification = fkBucket.classification;

      return fkBucket.references.map((fk) => ({
        id: `${fk.fromTable}-${fk.fromColumn}-${fk.toTable}-${fk.toColumn}`,
        source: fk.fromTable,
        sourceHandle: `${fk.fromColumn}-source`,
        target: fk.toTable,
        targetHandle: `${fk.toColumn}-target`,
        type: "tableNode",
        data: {
          label: `${fk.fromTable}.${fk.fromColumn} → ${fk.toTable}.${fk.toColumn}`,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 30,
          height: 30,
          color: secondaryText,
        },
        style: {
          stroke: classifiedStyling(classification),
        },
      }));
    });
  }, [classifiedData, secondaryText]);
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges);
  useEffect(() => {
    const layoutFlow = async () => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await getLayoutedElements(baseNodes, baseEdges, "RIGHT");

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    };

    layoutFlow();
  }, [baseNodes, baseEdges]);

  const edgeTypes = useMemo(
    () => ({
      custom: CustomHoverEdge,
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

      {/* Zoom controls */}
      <Box
        position="absolute"
        top="20px"
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
