import { useMemo, useCallback } from "react";
import "@xyflow/react/dist/style.css";

import {
  ReactFlow,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from "@xyflow/react";

import dagre from "@dagrejs/dagre";
import { useRouter } from "next/router";
import {
  fkBucket,
  TableMappingClassification,
  TableSchema,
} from "../../common/interfaces";
import { TableNode } from "./tableNode";
import { CustomHoverEdge } from "./customEdge";
import { redirect } from "next/dist/server/api-utils";

interface TableFlowProps {
  tableData: TableSchema[];
  classifiedData: Record<string, fkBucket>;
}

const nodeWidth = 170;
const nodeHeight = 50;

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  dagreGraph.setGraph({
    rankdir: "TB",
    ranksep: 150,
    nodesep: 150,
  });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const layout = dagreGraph.node(node.id);
      return {
        ...node,
        targetPosition: "top",
        sourcePosition: "bottom",
        position: {
          x: layout.x - nodeWidth / 2,
          y: layout.y - nodeHeight / 2,
        },
      };
    }),
    edges,
  };
};

export const TableFlow: React.FC<TableFlowProps> = ({
  tableData,
  classifiedData,
}) => {
  const router = useRouter();
  const secondaryText = "#444be5";

  const nodeTypes = { tableNode: TableNode };

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
        type: "custom",
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

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(baseNodes, baseEdges),
    [baseNodes, baseEdges],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
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

  return (
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
    >
      <Background />
    </ReactFlow>
  );
};
