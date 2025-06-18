// pages/index.js
import {
  Box,
  Heading,
  Button,
  Input,
  Text,
  Flex,
  VStack,
  Link,
} from "@chakra-ui/react";
import { TableFlow } from "../components/table/tableFlow";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";
import { Background } from "@xyflow/react";
export default function Home() {
  const [tableData, setTableData] = useState();
  const [dbURI, setDbURI] = useState("");
  const onSubmit = () => {
    console.log("onsubmit:", dbURI);
    axios
      .post("/api/table", { uri: dbURI })
      .then((res) => {
        console.log(res.data);
        setTableData(res.data);
      })
      .catch((err) => console.error(err));
  };
  const primaryText = "#F7FAFC";
  const secondaryText = "#444be5";
  const backgroundColor = "#141414";
  const Sidebar = () => {
    return (
      <Flex height="95vh">
        <Box color="white" p={4}>
          <VStack align="start" spacing={10}>
            <Heading size="xl">Database Intropection and Discovery</Heading>
            <Heading
              size="md"
              fontWeight="light"
              color="#CACBF9"
              textWrap="wrap"
            >
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
            </Heading>
            <Input
              size="sm"
              variant="flushed"
              color={primaryText}
              name="dbURI"
              onChange={(e) => {
                setDbURI(e.target.value);
                console.log(e.target.value);
              }}
              placeholder="Enter DB URI e.g. postgresql://user:password@localhost:51214/chinook"
            />

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <Button
                size="sm"
                backgroundColor={secondaryText}
                color={primaryText}
                onClick={onSubmit}
              >
                Generate
              </Button>
            </div>
          </VStack>
        </Box>
      </Flex>
    );
  };
  return (
    <div
      style={{
        display: "flex", // 👈 side-by-side layout
        backgroundColor: "#141414",
        height: "100vh", // full viewport height (instead of 100rem)
        overflow: "hidden", // prevent outer scrollbars if unwanted
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          width: "20vw",
          position: "fixed",
          borderRadius: 20,
          backgroundColor: "#F7FAFC05",
          boxShadow: secondaryText,
          border: ".5px solid #F7FAFC",
        }}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        style={{
          marginLeft: "20vw", // 👈 match sidebar width
          padding: "1rem",
          flexGrow: 1,
          overflow: "auto",
          // height: "100vh",
        }}
      >
        {tableData && (
          <>
            <TableFlow tableData={tableData} />
          </>
        )}
      </div>
    </div>
  );
}
