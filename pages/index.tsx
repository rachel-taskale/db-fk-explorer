// pages/index.js
import { Box, Heading, Button, Input } from "@chakra-ui/react";
import { TableFlow } from "../components/table/tableFlow";
import { useState } from "react";
import { primaryText, secondaryText, backgroundColor } from "../common/styles";

import axios from "axios";
export default function Home() {
  const [tableData, setTableData] = useState();
  const [dbURI, setDbURI] = useState("");
  const onSubmit = () => {
    console.log(dbURI);
    axios
      .post("/api/table", { uri: dbURI })
      .then((res) => {
        console.log("here: ", res.data);
        setTableData(res.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      style={{
        backgroundColor: "#141414",
        height: "100rem",
        justifyItems: "center",
        // alignContent: "center",
      }}
    >
      <Box
        mt="25vh"
        width="50vh"
        backgroundColor={backgroundColor}
        color={primaryText}
        display="inline-block"
        spaceY={10}
      >
        <div>
          <Heading size="2xl">Database Intropection and Discovery</Heading>
          <Heading size="lg" fontWeight="light" color="#CACBF9">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor{" "}
          </Heading>
        </div>
        <Input
          size="lg"
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
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button
            size="lg"
            backgroundColor={secondaryText}
            color={primaryText}
            onClick={onSubmit}
          >
            Generate
          </Button>
        </div>
      </Box>
      {tableData && (
        <div
          style={{
            width: "150vh",
            height: "100vh",
            marginTop: 50,
          }}
        >
          made it here
          <Heading size="2xl">TableFlow</Heading>
          <TableFlow tableData={tableData} />
        </div>
      )}
    </div>
  );
}
