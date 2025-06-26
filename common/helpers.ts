import { classifyTables } from "./classifier";
import { testDBClientConnection, createDBClient } from "./client";
import { classifiedFile, introspectedDataFile } from "./constants";
import { introspectDB } from "./dbIntrospection";
import { TableSchema, ForeignKeyReference } from "./interfaces";
import { writeDataToDB } from "./db";

export const GetAllTableData = async (dbURI: string) => {
  const connectionTimeout = 10000;
  const isValid = await Promise.race([
    testDBClientConnection(dbURI),
    new Promise<boolean>((_, reject) =>
      setTimeout(
        () => reject(new Error("Connection timeout")),
        connectionTimeout,
      ),
    ),
  ]);

  if (!isValid) {
    throw Error("Failed to connect to DB");
  }

  const client = createDBClient(dbURI);

  const introspectionTimeout = 30000;

  // introspect all the data in the DB
  const result = await Promise.race([
    introspectDB(client),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Introspection timeout")),
        introspectionTimeout,
      ),
    ),
  ]);

  const [data, foreignKeyData] = result as [
    TableSchema[],
    ForeignKeyReference[],
  ];

  // create classification model & weighted graph
  const classifiedData = classifyTables(foreignKeyData);
  writeDataToDB(classifiedFile, classifiedData);
  writeDataToDB(introspectedDataFile, data);

  return [data, classifiedData];
};
