import { json } from "stream/consumers";
import {
  FKBucket,
  ForeignKeyReference,
  TableMappingClassification,
} from "./interfaces";
import { writeDataToDB } from "./db";
import { classifiedFile } from "./constants";

export function classifyTables(fkRefs: ForeignKeyReference[]) {
  const outboundMap: Record<string, FKBucket> = {};
  const inboundCount: Record<string, number> = {};

  // Group FKs by source and count inbound FKs
  for (const fk of fkRefs) {
    const fromKey = `${fk.fromTable}#${fk.fromColumn}`;
    const toKey = `${fk.toTable}#${fk.toColumn}`;

    // Count how many point TO each toTable.toColumn
    inboundCount[toKey] = (inboundCount[toKey] || 0) + 1;

    // Initialize source map entry
    if (!(fromKey in outboundMap)) {
      outboundMap[fromKey] = {
        classification: TableMappingClassification.OneToOne,
        references: [],
      };
    }
    console.log(fk);

    outboundMap[fromKey]!.references.push(toKey);
  }
  console.log(outboundMap);

  for (const [_, bucket] of Object.entries(outboundMap)) {
    const references = bucket.references;
    // First see if it is a many-to-many connection
    const allUniqueTargets = new Set(bucket.references.map((fk) => fk));
    console.log(allUniqueTargets);
    const multipleInboundConnections = bucket.references.filter((i) => {
      return (inboundCount[i] || 0) > 1;
    });
    if (allUniqueTargets.size >= 2 && multipleInboundConnections.length >= 2) {
      bucket.classification = TableMappingClassification.ManyToMany;
      // If we more than one reference then that means one to many relationship
    } else if (references.length > 1) {
      bucket.classification = TableMappingClassification.OneToMany;
    } else {
      //  At this point we have determined that there is only one item in the reference
      const fk = references[0];
      const inboundReferencesToTable = inboundCount[fk] || 0;
      if (inboundReferencesToTable > 1) {
        bucket.classification = TableMappingClassification.ManyToOne;
      } else {
        bucket.classification = TableMappingClassification.OneToOne;
      }
    }
  }

  return outboundMap;
}
