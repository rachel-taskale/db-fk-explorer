// pages/index.tsx
import { useEffect, useState } from "react";
// import ReactFlow, { Node } from "react-flow-renderer";
import axios from "axios";

export default function HomePage() {
  const [nodes, setNodes] = useState<Node[]>([]);

  // Fetch nodes from the API
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await axios.get("/api/nodes");
        console.log(res);
        // setNodes(fetched);
      } catch (err) {
        console.error("Failed to fetch nodes", err);
      }
    };

    fetchNodes();
  }, []);

  return (
    <div>
      <div>here</div>
      <input></input>
    </div>
  );
}
