import type { NextApiRequest, NextApiResponse } from "next";
import { createDBClient } from "@/common/client";

export async function get(req: NextApiRequest, res: NextApiResponse) {
  const dbURI = process.env.DATABASE_URL;
  if (!dbURI) {
    return res.status(500).json({ message: "No DB URI found" });
  }
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ message: "Missing table name" });
  }
  const client = createDBClient(dbURI);
  if (!client) {
    return res.status(500).json({ message: "Could not create DB client" });
  }

  const isValidIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id);
  if (!isValidIdentifier) {
    return res.status(400).json({ message: "Invalid table name" });
  }

  try {
    const query = `SELECT * FROM "${id}" LIMIT 100`;
    const result = await client.query(query);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Query failed:", err);
    return res.status(500).json({ message: "Query failed" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return await get(req, res);
      default:
        return res.setHeader("Allow", ["GET", "POST"]).status(405).end();
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("API Error:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
}
