// pages/api/session/set-dburi.ts
import { withSession } from "@/lib/session";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { dbURI } = req.body;

      if (typeof dbURI !== "string") {
        return res.status(400).json({ error: "Missing or invalid dbURI" });
      }

      req.session.dbURI = dbURI;
      await req.session.save();

      return res.status(200).json({ ok: true }); // ✅ THIS IS REQUIRED
    } catch (error) {
      console.error("Error in set-dburi:", error);
      return res.status(500).json({ error: "Internal Server Error" }); // ✅ REQUIRED
    }
  },
);
