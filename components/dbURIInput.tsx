import { successGreen } from "@/common/styles";
import api from "@/lib/axios";
import { Box, Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BiSolidCircle } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

export const DBURIInput = () => {
  const [dbURI, setDbURI] = useState("");
  const [open, setOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/session/set-dburi", { dbURI });
      setIsConnected(true);
    } catch (err: any) {
      console.error("Failed to set dbURI:", err);
      setIsConnected(false);
      setError("Failed to connect. Please check your URI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box width="100%">
      <Flex
        align="center"
        justify="space-between"
        onClick={() => setOpen((prev) => !prev)}
        cursor="pointer"
      >
        <Flex align="center" gap={4}>
          <Text fontSize="sm" color="gray.400">
            Database URI
          </Text>
          {isConnected && (
            <Flex align="center" gap={1}>
              <BiSolidCircle
                style={{ fontSize: "0.5rem" }}
                color={successGreen}
              />
              <Text fontSize="xs" color={successGreen}>
                Connected
              </Text>
            </Flex>
          )}
        </Flex>
        <Icon
          as={IoIosArrowDown}
          transition="transform 0.2s ease"
          transform={open ? "rotate(180deg)" : "rotate(0deg)"}
          boxSize={4}
          color="gray.400"
        />
      </Flex>

      {open && (
        <Box width="100%">
          <Input
            placeholder="e.g. postgresql://..."
            value={dbURI}
            onChange={(e) => setDbURI(e.target.value)}
            size="sm"
            variant="filled"
            bg="#2a2d34"
            color="#f5f6fa"
            _hover={{ bg: "#32363f" }}
            _focus={{
              borderColor: "#635bff",
              boxShadow: "0 0 0 1px #635bff",
            }}
          />
          <Button
            mt={3}
            width="100%"
            size="sm"
            bg="#635bff"
            color="white"
            fontWeight="medium"
            _hover={{ bg: "#7a6fff" }}
            onClick={onSubmit}
          >
            Generate New Schema
          </Button>
        </Box>
      )}
    </Box>
  );
};
