// lib/session.ts (iron-session v7+)
import { getIronSession, SessionOptions } from "iron-session";
import type { NextApiRequest, NextApiResponse } from "next";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "db-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSession(
  handler: (req: NextApiRequest, res: NextApiResponse) => any,
) {
  return async function wrappedHandler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const session = await getIronSession(req, res, sessionOptions);
    (req as any).session = session;

    return handler(req, res); // ✅ YOU MUST CALL THIS
  };
}
