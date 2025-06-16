// pages/api/nodes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import connectDBClient, { testDBClientConnection } from "../../common/client";
import dotenv from "dotenv";

async function get(req: NextApiRequest, res: NextApiResponse) {
  dotenv.config();

  const dbURI = process.env.DATABASE_URL ?? "";
  const client = testDBClientConnection(dbURI);

  return res.status(200).json(client);
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
