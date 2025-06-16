import { useMemo } from "react";
import { ReactFlow, Background } from "@xyflow/react";
import { css } from "@emotion/react";
import { Box, Heading, Button, Input, Text } from "@chakra-ui/react";

import TableNode from "./tableNode";

import "@xyflow/react/dist/style.css";
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

export const tables = [
  {
    id: "users",
    name: "Users",
    fields: ["id", "name", "email", "role_id"],
    foreignKeys: [{ field: "role_id", references: "roles" }],
  },
  {
    id: "roles",
    name: "Roles",
    fields: ["id", "role_name"],
    foreignKeys: [],
  },
];
const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export const TableFlow = () => {
  const nodeTypes = useMemo(() => ({ tableNode: TableNode }), []);

  const nodes = useMemo(() => {
    return tables.map((table, index) => ({
      id: table.id,
      type: "tableNode",
      position: { x: 100 + index * 300, y: 100 },
      data: {
        name: table.name,
        fields: table.fields,
      },
    }));
  }, []);

  const edges = useMemo(() => {
    const edges = [];
    for (const table of tables) {
      for (const fk of table.foreignKeys) {
        edges.push({
          id: `${table.id}-${fk.references}`,
          source: table.id,
          sourceHandle: `${fk.field}-source`,
          target: fk.references,
          targetHandle: `id-target`, // assumes FK always targets "id"
          animated: true,
        });
      }
    }
    return edges;
  }, []);

  return (
    <Box style={{ width: "100vh", height: "50vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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
    </Box>
  );
};
