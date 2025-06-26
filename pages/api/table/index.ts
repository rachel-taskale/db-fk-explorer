import type { NextApiRequest, NextApiResponse } from "next";
import { createApiHandler } from "../createApiHandler";
import { sanitizeString, validateDbURI } from "../../../common/client";
import { withSession } from "@/lib/session";
import { GetAllTableData } from "@/common/helpers";

async function get(req: NextApiRequest, _: NextApiResponse) {
  try {
    const uri = req.session.dbURI;

    if (!validateDbURI(uri)) {
      throw Error("Invalid database URI format");
    }

    const sanitizedURI = sanitizeString(uri);
    const [data, classifiedData] = await GetAllTableData(sanitizedURI);

    return {
      tableData: data,
      classifiedData: classifiedData,
    };
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
    throw Error("Endpoint does not exist");
  },
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    return await get(req, res);
  },
};

export default withSession(createApiHandler(handlers));
