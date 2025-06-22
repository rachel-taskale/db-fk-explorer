import { json } from "stream/consumers";
import {
  ForeignKeyReference,
  TableMappingClassification,
  TableSchema,
} from "./interfaces";

interface fkBucket {
  classification: TableMappingClassification;
  references: ForeignKeyReference[];
}

export function classifyTables(fkRefs: ForeignKeyReference[]) {
  type fkBucket = {
    classification: TableMappingClassification;
    references: ForeignKeyReference[];
  };

  const outboundMap: Record<string, fkBucket> = {};
  const inboundCount: Record<string, number> = {};

  // Step 1: Group FKs by source and count inbound FKs
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

    outboundMap[fromKey]!.references.push(fk);
  }

  for (const [fromKey, bucket] of Object.entries(outboundMap)) {
    const references = bucket.references;

    const allUniqueTargets = new Set(bucket.references.map((fk) => fk.toTable));
    const multipleInboundConnections = bucket.references.filter((i) => {
      return (inboundCount[`${i.toTable}#${i.toColumn}`] || 0) > 1;
    });
    if (allUniqueTargets.size >= 2 && multipleInboundConnections.length >= 2) {
      bucket.classification = TableMappingClassification.ManyToMany;
    } else if (references.length > 1) {
      bucket.classification = TableMappingClassification.OneToMany;
    } else {
      //  At this point we have determined that there is only one item in the reference
      const fk = references[0];
      const inboundReferencesToTable =
        inboundCount[`${fk.toTable}#${fk.toColumn}`] || 0;
      if (inboundReferencesToTable > 1) {
        bucket.classification = TableMappingClassification.ManyToOne;
      } else {
        bucket.classification = TableMappingClassification.OneToOne;
      }
    }
  }

  // Final Output
  // console.log("====== CLASSIFIED FKs ======");
  // for (const [key, bucket] of outboundMap.entries()) {
  //   console.log(key, bucket.classification, bucket.references);
  // }
  console.log(outboundMap);
  return outboundMap;
}
