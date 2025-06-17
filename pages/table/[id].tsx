// pages/table/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TableDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/table/${id}`);
      const data = await res.json();
      setTableData(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!tableData || tableData.length === 0) return <div>No data found</div>;

  const columnNames = Object.keys(tableData[0]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Table: {id}</h1>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {columnNames.map((col) => (
              <th
                key={col}
                style={{
                  border: "1px solid #F7FAFC50",
                  padding: "8px",
                  background: "#F7FAFC08",
                  textAlign: "left",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, idx) => (
            <tr key={idx}>
              {/* <span onClick={() => router.push(`/table/${idx}`)}> */}
              {columnNames.map((col) => (
                <td
                  key={col}
                  style={{
                    border: ".5px solid #F7FAFC50",
                    padding: "8px",
                    fontFamily: "monospace",
                  }}
                >
                  {row[col]?.toString() || ""}
                </td>
              ))}
              {/* </span> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
