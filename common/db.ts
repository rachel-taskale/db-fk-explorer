import { readFileSync, writeFileSync } from "fs";
import path from "path";

export const writeDataToDB = (fileName: string, content: any) => {
  const filePath = path.resolve(process.cwd(), "db", path.basename(fileName));
  writeFileSync(filePath, JSON.stringify(content, null, 2), "utf8");
};

export const readDataFromDB = (fileName: string) => {
  const raw = readFileSync(fileName, "utf8");
  const parsed = JSON.parse(raw);
  return parsed;
};
