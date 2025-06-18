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
