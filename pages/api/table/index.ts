import type { NextApiRequest, NextApiResponse } from "next";
import { createApiHandler } from "../createApiHandler";
import {
  createDBClient,
  sanitizeString,
  testDBClientConnection,
  validateDbURI,
} from "../../../common/client";
import { introspectDB } from "@/common/dbIntrospection";

async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Input validation
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const { dbURI } = req.body;

    if (dbURI && typeof dbURI !== "string") {
      return res.status(400).json({ message: "dbURI must be a string" });
    }

    const resolvedDbURI = dbURI ?? process.env.DATABASE_URL;

    if (!resolvedDbURI) {
      return res.status(400).json({ message: "No DB URI provided" });
    }

    if (!validateDbURI(resolvedDbURI)) {
      return res.status(400).json({ message: "Invalid database URI format" });
    }

    const sanitizedURI = sanitizeString(resolvedDbURI);

    const connectionTimeout = 10000;
    const isValid = await Promise.race([
      testDBClientConnection(sanitizedURI),
      new Promise<boolean>((_, reject) =>
        setTimeout(
          () => reject(new Error("Connection timeout")),
          connectionTimeout
        )
      ),
    ]);

    if (!isValid) {
      return res.status(500).json({ message: "Failed to connect to DB" });
    }

    const client = createDBClient(sanitizedURI);

    const introspectionTimeout = 30000;
    const data = await Promise.race([
      introspectDB(client),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Introspection timeout")),
          introspectionTimeout
        )
      ),
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error("Database API error:", error);

    const message =
      error instanceof Error && error.message.includes("Invalid characters")
        ? error.message
        : "Internal server error";

    res.status(500).json({ message });
  }
}

const handlers = {
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    await post(req, res);
  },
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ status: "healthy" });
  },
};

export default createApiHandler(handlers);
