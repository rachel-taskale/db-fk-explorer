// pages/index.js
import { Box, Heading, Button, Input, Text } from "@chakra-ui/react";
import { TableFlow } from "../components/tableFlow";
export default function Home() {
  const primaryText = "#F7FAFC";
  const secondaryText = "#444be5";
  const backgroundColor = "#141414";
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
        m={40}
        p={10}
        border="1px solid #25324a"
        borderRadius={20}
        backgroundColor={backgroundColor}
        color={primaryText}
        display="inline-block"
        spaceY={10}
      >
        <div>
          <Heading size="5xl">Database Intropection and Discovery</Heading>
          <Heading size="xl" fontWeight="light" color="#CACBF9">
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
          size="2xl"
          variant="flushed"
          color={primaryText}
          placeholder="Enter DB URI ex. postgresql://user:password@localhost:51214/chinook"
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            mt={4}
            size="2xl"
            backgroundColor={secondaryText}
            color={primaryText}
          >
            Generate
          </Button>
        </div>
      </Box>
      <div>
        <Text>TableFlow</Text>

        <TableFlow />
      </div>
    </div>
  );
}
