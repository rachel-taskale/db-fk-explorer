export interface ForeignKeyReference {
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export interface TableSchema {
  tableName: string;
  fields: Map<string, string>;
  foreignKeys: ForeignKeyReference[];
}
