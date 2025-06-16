import { Client } from "pg";

export default async function createDBClient(dbURI: string) {
  const client = new Client({
    connectionString: dbURI,
  });
  try {
    await client.connect();
    console.log("Successfully connected to database");
    return client;
  } catch (err) {
    console.error("Connection error:", err);
  }
  return client;
}

export async function testDBClientConnection(dbURI: string) {
  const client = new Client({
    connectionString: dbURI,
  });
  try {
    await client.connect();
    const res = await client.query(`    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
      AND table_schema NOT IN ('pg_catalog', 'information_schema');`);
    return res.rows[0];
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.end();
  }
}
