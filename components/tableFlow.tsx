import { useMemo } from "react";
import { ReactFlow, Background, Node } from "@xyflow/react";
import { css } from "@emotion/react";
import { Box, Heading, Button, Input, Text } from "@chakra-ui/react";
import { TableSchema } from "../common/interfaces";

import "@xyflow/react/dist/style.css";
import { TableNode } from "./tableNode";
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

const pseudoRandom = (str: string) =>
  str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const TableFlow: React.FC<TableFlowProps> = ({ tableData }) => {
  const nodeTypes = useMemo(() => ({ tableNode: TableNode }), []);

  const nodes: Node[] = useMemo(() => {
    return tableData.map((table) => {
      const seed = pseudoRandom(table.tableName);
      return {
        id: table.tableName,
      type: "tableNode",
        position: {
          x: (seed * 17) % 800,
          y: (seed * 31) % 600,
        },
      data: {
          name: table.tableName,
          fields: Array.from(Object.keys(table.fields)),
      },
      };
    });
  }, [tableData]);

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
