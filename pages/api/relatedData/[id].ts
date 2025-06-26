import type { NextApiRequest, NextApiResponse } from "next";
import { createApiHandler } from "../createApiHandler";
import { withSession } from "@/lib/session";
import { classifiedFile } from "@/common/constants";
import { readDataFromDB } from "@/common/db";
import { FKBucket } from "@/common/interfaces";

async function getRelatedData(
  classifiedData: Record<string, FKBucket>,
  id: string | string[],
) {
  const relatedTables = Object.entries(classifiedData).flatMap(
    ([key, item]) => {
      if (key.includes(id) && Array.isArray(item.references)) {
        return item.references;
      }
      return [];
    },
  );
  return relatedTables;
}

export async function get(req: NextApiRequest, _: NextApiResponse) {
  const dbURI = req.session.dbURI;
  const { id } = req.query;
  const classifiedData = readDataFromDB(classifiedFile);
  return getRelatedData(classifiedData, id);
}

const handlers = {
  POST: async (_: NextApiRequest, res: NextApiResponse) => {
    throw Error("Endpoint doesn't exist");
  },
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    return await get(req, res);
  },
};

export default withSession(createApiHandler(handlers));
