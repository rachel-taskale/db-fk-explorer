import type { NextApiRequest, NextApiResponse } from "next";
import { createDBClient, testDBClientConnection } from "@/common/client";
import { createApiHandler } from "../createApiHandler";
import { withSession } from "@/lib/session";
import {
  FKBucket,
  ForeignKeyReference,
  TableData,
  TableSchema,
} from "@/common/interfaces";
import { Pool } from "pg";
import { classifyTables } from "@/common/classifier";
import { introspectDB } from "@/common/dbIntrospection";
import Id from "./row/[id]";

async function getRelatedData(
  classifiedData: Record<string, FKBucket>,
  client: Pool,
  id: string | string[],
) {
  const relatedTables = Object.entries(classifiedData).flatMap(
    ([key, item]) => {
      if (key.includes(id) && Array.isArray(item.references)) {
        return item.references;
      }
      return [];
    },
  );
  // const allRelatedData: TableData[] = await Promise.all(
  //   relatedTables.map(async (i) => {
  //     const [tableName] = i.split("#");
  //     const getTableDataQuery = `SELECT * FROM "${tableName}" LIMIT $1`;
  //     const result = await client.query(getTableDataQuery, [10]);
  //     return {
  //       name: tableName,
  //       data: result.rows,
  //       fields: result.fields,
  //     };
  //   }),
  // );
  return relatedTables;
}

async function helper(dbURI: string) {
  const connectionTimeout = 10000;
  const isValid = await Promise.race([
    testDBClientConnection(dbURI),
    new Promise<boolean>((_, reject) =>
      setTimeout(
        () => reject(new Error("Connection timeout")),
        connectionTimeout,
      ),
    ),
  ]);

  if (!isValid) {
    throw Error("Failed to connect to DB");
  }

  const client = createDBClient(dbURI);

  const introspectionTimeout = 30000;

  // introspect all the data in the DB
  const result = await Promise.race([
    introspectDB(client),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Introspection timeout")),
        introspectionTimeout,
      ),
    ),
  ]);

  const [data, foreignKeyData] = result as [
    TableSchema[],
    ForeignKeyReference[],
  ];

  // create classification model & weighted graph
  const classifiedData = classifyTables(foreignKeyData);
  return classifiedData;
}

export async function get(req: NextApiRequest, res: NextApiResponse) {
  const dbURI = req.session.dbURI;
  if (!dbURI) {
    throw Error("No DB URI found");
  }
  const { id } = req.query;
  if (!id) {
    throw Error("Missing table name");
  }

  const client = createDBClient(dbURI);
  if (!client) {
    throw Error("Could not create DB client");
  }

  const isValidIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id);
  if (!isValidIdentifier) {
    throw Error("Invalid table name");
  }
  const classifiedData = await helper(dbURI);
  const relatedData = await getRelatedData(classifiedData, client, id);

  try {
    const query = `SELECT * FROM "${id}" LIMIT 100`;

    const result = await client.query(query);
    return {
      name: id.toString(),
      data: result.rows,
      fields: result.fields,
      relatedData: relatedData,
    };
  } catch (err) {
    console.error("DB query failed:", err);
    return { error: "Query failed" };
  }
}

const handlers = {
  POST: async (_: NextApiRequest, res: NextApiResponse) => {
    throw Error("Endpoint doesn't exist");
  },
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    return await get(req, res);
  },
};

export default withSession(createApiHandler(handlers));
