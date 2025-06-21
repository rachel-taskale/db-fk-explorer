export interface ForeignKeyReference {
  fromColumn: string;
  fromTable: string;
  toColumn: string;
}

export interface TableSchema {
  tableName: string;
  fields: { [key: string]: string };
  foreignKeys: ForeignKeyReference[];
}
