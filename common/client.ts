import { Pool } from "pg";

export function createDBClient(dbURI: string) {
  return new Pool({
    connectionString: dbURI,
  });
}

export async function testDBClientConnection(dbURI: string) {
  const client = createDBClient(dbURI);
  try {
    const res = await client.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      LIMIT 1
    `);
    return res.rows[0];
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.end(); // ends the pool and closes all clients
  }
}
export const validateDbURI = (uri: string): boolean => {
  const isValidScheme = [
    "postgresql://",
    "postgres://",
    "mysql://",
    "mongodb://",
  ].some((scheme) => uri.toLowerCase().startsWith(scheme));

  if (!isValidScheme) return false;

  try {
    new URL(uri);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeString = (uri: string): string => {
  const blacklistedStrings = [";", "--", "/*", "*/", "xp_", "sp_"];

  for (const str of blacklistedStrings) {
    if (uri.toLowerCase().includes(str)) {
      throw new Error("Invalid characters in database URI");
    }
  }

  return uri.trim();
};
