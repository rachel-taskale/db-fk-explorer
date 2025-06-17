import { useCallback, useMemo } from "react";
import { ReactFlow, Background, Node, useEdgesState } from "@xyflow/react";
import { css } from "@emotion/react";
import { Box, Heading, Button, Input, Text } from "@chakra-ui/react";
import { TableSchema } from "../../common/interfaces";

import "@xyflow/react/dist/style.css";
import { TableNode } from "./tableNode";
import CustomEdge from "./customEdge";
import router, { useRouter } from "next/router";
const nodeStyle = css`
  .dark & {
    background: #777;
    color: white;
  }
  .light & {
    background: white;
    color: #111;
  }
`;

interface TableFlowProps {
  tableData: TableSchema[];
}

const edgeTypes = {
  custom: CustomEdge,
};
const pseudoRandom = (str: string) =>
  str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const TableFlow: React.FC<TableFlowProps> = ({ tableData }) => {
  const nodeTypes = useMemo(() => ({ tableNode: TableNode }), []);
  const router = useRouter();

  const nodes: Node[] = useMemo(() => {
    return tableData.map((table, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);

      const offset = pseudoRandom(table.tableName) % 30;

      return {
        id: table.tableName,
        type: "tableNode",
        position: {
          x: 100 + col * 300 + offset,
          y: 100 + row * 200 + offset,
        },
        data: {
          name: table.tableName,
          fields: Array.from(Object.keys(table.fields)),
        },
      };
    });
  }, [tableData]);
  const edges = useMemo(() => {
    return tableData.flatMap((table) =>
      table.foreignKeys.map((fk) => ({
        id: `${table.tableName}-${fk.toTable}-${fk.fromColumn}`,
        source: table.tableName,
        sourceHandle: `${fk.fromColumn}-source`,
        target: fk.toTable,
        targetHandle: `${fk.toColumn}-target`,
        type: "custom",
        data: {
          label: `${table.tableName}.${fk.fromColumn} → ${fk.toTable}.${fk.toColumn}`,
        },
        style: { stroke: "#555" },
      }))
    );
  }, [tableData]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      router.push(`/table/${node.id}`);
    },
    [router]
  );

  return (
    // <Box style={{ width: "80vw", height: "100vh" }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeClick={onNodeClick}
      fitView
      nodesDraggable={false}
      zoomOnScroll={false}
      panOnScroll={false}
      panOnDrag={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
    >
      <Background />
    </ReactFlow>
    // </Box>
  );
};
