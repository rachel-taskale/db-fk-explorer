// pages/table/[tableId]/row/[rowId].tsx
import { useRouter } from "next/router";

export default function RowDetail() {
  const router = useRouter();
  const { tableId, rowId } = router.query;

  return (
    <div>
      <h1>Table: {tableId}</h1>
      <h2>Row ID: {rowId}</h2>
      {/* Fetch and render row data here */}
    </div>
  );
}
