// lib/api/createApiHandler.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Method = "GET" | "POST" | "PUT" | "DELETE";

type Handlers = Partial<
  Record<Method, (req: NextApiRequest, res: NextApiResponse) => Promise<any>>
>;

export function createApiHandler(handlers: Handlers) {
  return async function wrappedHandler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const handler = handlers[req.method as Method];

    if (!handler) {
      res.setHeader("Allow", Object.keys(handlers));
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.error("API Error:", (error as Error).message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
