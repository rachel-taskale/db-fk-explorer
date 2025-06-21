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
    console.log(req.body);

    if (!req.body || typeof req.body !== "object") {
      throw new Error("Invalid request body");
    }

    const { uri } = req.body;

    if (typeof uri !== "string") {
      throw new Error("`uri` must be a string");
    }

    if (!validateDbURI(uri)) {
      throw Error("Invalid database URI format");
    }

    const sanitizedURI = sanitizeString(uri);

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

    console.log(data);
    return data;
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
    return await post(req, res);
  },
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    throw Error("Endpoint does not exist");
  },
};

export default createApiHandler(handlers);
