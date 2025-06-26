export interface ForeignKeyReference {
  fromColumn: string;
  fromTable: string;
  toColumn: string;
  toTable: string;
}

export interface FieldSchema {
  type: string;
  reference?: {
    tableName: string;
    columnName: string;
  };
}

export interface TableSchema {
  tableName: string;
  fields: Record<string, FieldSchema>;
}

export enum TableMappingClassification {
  OneToMany = "ONE_TO_MANY",
  ManyToOne = "MANY_TO_ONE",
  OneToOne = "ONE_TO_ONE",
  ManyToMany = "MANY_TO_MANY",
}

export interface FKBucket {
  classification: TableMappingClassification;
  references: string[];
}

export enum Position {
  top = "TOP",
  bottom = "BOTTOM",
  right = "RIGHT",
  left = "LEFT",
}

export interface NodePositions {
  sourceNode: Position;
  targetNode: Position;
}

export interface TableData {
  name: string;
  data: any;
  fields: any;
  relatedData?: string[];
}
