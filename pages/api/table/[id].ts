import type { NextApiRequest, NextApiResponse } from "next";
import createDBClient from "@/common/client";

export async function get(req: NextApiRequest, res: NextApiResponse) {
  const dbURI = process.env.DATABASE_URL!;
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ message: "Missing table name" });
  }

  const client = await createDBClient(dbURI);
  if (!client) {
    return res.status(500).json({ message: "Could not create DB client" });
  }

  try {
    const query = `SELECT * FROM "${id}" LIMIT 100`; // quote the identifier
    const result = await client.query(query);
    await client.end();
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
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
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}
