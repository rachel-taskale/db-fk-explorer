import { Client } from "pg";
import connectDBClient, { testDBClientConnection } from "./client";
import { TableSchema } from "./interfaces";

export default async function introspectDB(client: Client) {
  if (!client) {
    return;
  }
  const columnQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2
      ORDER BY ordinal_position;
      `;

  const tableQuery = `
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
      AND table_schema NOT IN ('pg_catalog', 'information_schema');
  `;

  const foreignKeyQuery = `
      SELECT 
        kcu.column_name,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE 
        tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = $1
        AND tc.table_name = $2;
      `;

  client.connect();

  // Get tables
  const tables = await client.query(tableQuery);
  const metadata: TableSchema[] = [];
  for (const row of tables.rows) {
    const { table_schema, table_name } = row;
    console.log(`\n📦 Table: ${table_schema}.${table_name}`);
    const tableSchema: TableSchema = {
      tableName: table_name,
      fields: new Map<string, string>(),
      foreignKeys: [],
    };

    // Get columns for this table
    const columns = await client.query(columnQuery, [table_schema, table_name]);
    let fields = new Map<string, string>();
    for (const col of columns.rows) {
      fields.set(col.column_name, col.data_type);
    }
    tableSchema.fields = fields;

    const foreignKeyRelations = await client.query(foreignKeyQuery, [
      table_schema,
      table_name,
    ]);
    let foreignKeys = [];
    if (foreignKeyRelations.rows.length > 0) {
      for (const fk of foreignKeyRelations.rows) {
        foreignKeys.push({
          fromColumn: fk.column_name,
          toTable: fk.foreign_table_name,
          toColumn: fk.foreign_column_name,
        });
        console.log(
          `    ${fk.column_name} → ${fk.foreign_table_schema}.${fk.foreign_table_name}(${fk.foreign_column_name})`
        );
      }
    }
    tableSchema.foreignKeys = foreignKeys;
    metadata.push(tableSchema);
  }
  return metadata;
}
