// pages/api/nodes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectDBClient, { testDBClientConnection } from "../../common/client";
import dotenv from "dotenv";
import createDBClient from "../../common/client";
import introspectDB from "@/common/dbIntrospection";
dotenv.config();

export async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { dbURI } = req.body;
    const resolvedDbURI = dbURI ?? process.env.DATABASE_URL;

    if (!resolvedDbURI) {
      return res.status(400).json({ message: "No DB URI provided" });
    }

    const isValid = await testDBClientConnection(resolvedDbURI);
    if (!isValid) {
      return res.status(500).json({ message: "Failed to connect to DB" });
    }

    const client = await createDBClient(resolvedDbURI);
    if (!client) {
      return res.status(500).json({ message: "Cannot create DB client" });
    }

    const data = await introspectDB(client); // you were missing `await` here!
    await client.end();

    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        console.log("TODO: implement get");
      case "POST":
        return await post(req, res);
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
