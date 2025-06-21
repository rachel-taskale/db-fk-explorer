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
      throw Error("Invalid request body");
    }
    const { dbURI } = req.body;

    if (dbURI && typeof dbURI !== "string") {
      throw Error("dbURI must be a string");
    }

    if (!dbURI) {
      throw Error("No DB URI provided");
    }

    if (!validateDbURI(dbURI)) {
      throw Error("Invalid database URI format");
    }

    const sanitizedURI = sanitizeString(dbURI);

    const connectionTimeout = 10000;
    const isValid = await Promise.race([
      testDBClientConnection(sanitizedURI),
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

    const client = createDBClient(sanitizedURI);

    const introspectionTimeout = 30000;
    const data = await Promise.race([
      introspectDB(client),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Introspection timeout")),
          introspectionTimeout,
        ),
      ),
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error("Database API error:", error);

    const message =
      error instanceof Error && error.message.includes("Invalid characters")
        ? error.message
        : "Internal server error";
    throw Error(message);
  }
}

const handlers = {
  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    await post(req, res);
  },
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).json({ status: "Endpoint does not exist" });
  },
};

export default createApiHandler(handlers);
