import { Pool } from "pg";
import { TableSchema, FieldSchema, ForeignKeyReference } from "./interfaces";
import { tableQuery, columnQuery, foreignKeyQuery } from "./sql";
export async function introspectDB(client: Pool) {
  // Get tables
  const tables = await client.query(tableQuery);
  const allForeignKeys: ForeignKeyReference[] = [];
  const metadata: TableSchema[] = [];
  for (const row of tables.rows) {
    const { table_schema, table_name } = row;
    const tableSchema: TableSchema = {
      tableName: table_name,
      fields: new Map<string, FieldSchema>(),
    };

    const columns = await client.query(columnQuery, [table_schema, table_name]);
    const fields = new Map<string, FieldSchema>();
    for (const col of columns.rows) {
      const columnName = col.column_name as string;
      const field: FieldSchema = { type: col.data_type };
      fields.set(columnName, field);
    }

    const foreignKeys = await client.query(foreignKeyQuery, [
      table_schema,
      table_name,
    ]);
    for (const fk of foreignKeys.rows) {
      const field = fields.get(fk.column_name);
      if (field) {
        allForeignKeys.push({
          fromTable: fk.foreign_table_name,
          fromColumn: fk.foreign_column_name,
          toColumn: fk.column_name,
          toTable: table_name,
        });
        const reference = {
          tableName: fk.foreign_table_name,
          columnName: fk.foreign_column_name,
        };
        field.reference = reference;
      }
    }
    tableSchema.fields = fields;

    metadata.push(tableSchema);
  }

  return [metadata, allForeignKeys];
}
