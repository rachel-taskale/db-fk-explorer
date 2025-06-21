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
import { TableSchema } from "../../common/interfaces";
import { TableNode } from "./tableNode";
import { CustomHoverEdge } from "./customEdge";

interface TableFlowProps {
  tableData: TableSchema[];
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

export const TableFlow: React.FC<TableFlowProps> = ({ tableData }) => {
  const router = useRouter();
  const secondaryText = "#444be5";

  const nodeTypes = { tableNode: TableNode };

  const baseNodes: Node[] = useMemo(() => {
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

  const baseEdges: Edge[] = useMemo(() => {
    return tableData.flatMap((table) =>
      table.foreignKeys.map((fk) => ({
        id: `${table.tableName}-${fk.fromTable}-${fk.fromColumn}`,
        source: table.tableName,
        sourceHandle: `${fk.fromColumn}-source`,
        target: fk.fromTable,
        targetHandle: `${fk.toColumn}-target`,
        type: "custom",
        data: {
          label: `${table.tableName}.${fk.fromColumn} → ${fk.fromTable}.${fk.toColumn}`,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 30,
          height: 30,
          color: secondaryText,
        },
        style: { stroke: "#555" },
      }))
    );
  }, [tableData]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(baseNodes, baseEdges),
    [baseNodes, baseEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const edgeTypes = useMemo(
    () => ({
      custom: CustomHoverEdge,
    }),
    []
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      router.push(`/table/${node.id}`);
    },
    [router]
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
