// pages/api/nodes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const nodes = await prisma.artist.findMany();
  return res.status(200).json(nodes);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return await get(req, res);
      case "POST":
        console.log("TODO: implement post");
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
