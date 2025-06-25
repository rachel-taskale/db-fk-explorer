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
import { primaryText, secondaryText } from "@/common/styles";
import { CrowFootNotation } from "@/assets/CrowFootNotation";

interface TableFlowProps {
  tableData: TableSchema[];
  classifiedData: Record<string, fkBucket>;
}

// First, define custom SVG markers for crow's foot notation

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

const nodeWidth = 350;
const nodeHeight = 350;

const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  direction: "RIGHT" | "DOWN",
  classifiedData: Record<string, fkBucket>,
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  console.log(nodes);
  const elkNodes = nodes.map((node) => ({
    id: node.id,
    width: nodeWidth,
    height: nodeHeight,
  }));
  console.log(edges);
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
    // Get all the fields in our classfied list that have connections

    // now go thru all the nodes we've generated and create a list of all them and their positions for comparison
    // to determine which side to put the node on

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

  // const positionedNodesWithReferences = positionedNodes.map((node) => {
  //   const nodeId = node["id"];

  //   const connectedFields = Object.entries(classifiedData).filter(([key]) =>
  //     key.includes(nodeId),
  //   );

  //   const references = positionedNodes.filter((item) =>
  //     Object.entries(connectedFields).some(([key, fieldData]) => {
  //       return fieldData[0].includes(item["id"]);
  //     }),
  //   );
  //   node["data"]["references"] = references;
  //   return { ...node };
  // });
  // console.log(positionedNodesWithReferences);

  return { nodes: positionedNodes, edges: edges };
};

export const TableFlow: React.FC<TableFlowProps> = ({
  tableData,
  classifiedData,
}) => {
  const router = useRouter();
  const nodeTypes = { tableNode: TableNode };

  const getMarkerTypes = (
    classification: TableMappingClassification,
    isNullable?: boolean,
  ) => {
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
  console.log(tableData);
  const baseNodes: Node[] = useMemo(() => {
    if (!Array.isArray(tableData)) return [];

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
  console.log(baseNodes);

  const baseEdges: Edge[] = useMemo(() => {
    if (!classifiedData || typeof classifiedData !== "object") return [];

    return Object.entries(classifiedData).flatMap(([key, fkBucket]) => {
      const classification = fkBucket.classification;
      const markers = getMarkerTypes(classification, false);
      const splitKey = key.split("#"); // [fromTable, fromColumn]

      return fkBucket.references.map((fk) => {
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
        await getLayoutedElements(baseNodes, baseEdges, "DOWN", classifiedData);

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
