import type { NextApiRequest, NextApiResponse } from "next";
import { createDBClient } from "@/common/client";
import { createApiHandler } from "../../createApiHandler";
import { withSession } from "@/lib/session";

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
  console.log("name: " + id);

  try {
    const query = `SELECT * FROM "${id}" LIMIT 100`;
    const result = await client.query(query);
    console.log(result);
    return result;
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
