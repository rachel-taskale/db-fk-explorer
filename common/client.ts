import { Client } from "pg";

export default function createDBClient(dbURI: string) {
  const client = new Client({
    connectionString: dbURI,
  });
  try {
    client.connect();
    console.log("Successfully connected to database");
    return client;
  } catch (err) {
    console.error("Connection error:", err);
  }
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
    console.log("===========here: ", res.rows[0]);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.end();
  }
}
