import type { NextApiRequest, NextApiResponse } from "next";
import { createDBClient } from "@/common/client";
import { createApiHandler } from "../createApiHandler";

export async function get(req: NextApiRequest, res: NextApiResponse) {
  const dbURI = process.env.DATABASE_URL;
  if (!dbURI) {
    throw Error("No DB URI found");
  }
  const id = req.query.id as string;

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

  const query = `SELECT * FROM "${id}" LIMIT 100`;
  const result = await client.query(query);
  return res.status(200).json(result.rows);
}

const handlers = {
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).json({ status: "Endpoint doesnt exist" });
  },
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    return await get(req, res);
  },
};

export default createApiHandler(handlers);
