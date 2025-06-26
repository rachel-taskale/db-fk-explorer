// pages/table/[id].tsx
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GoArrowLeft } from "react-icons/go";
import { primaryText_200, primaryText_500 } from "@/common/styles";
import { CustomTable } from "@/components/customTable";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function TableDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [tableReferences, setTableReferences] = useState();
  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/relatedData/${id}`);
      console.log(res.data);
      setTableReferences(res.data);
    };
    fetch();
  }, [id]);

  const borderColor = primaryText_200;
  return (
    <Box p={8}>
      <Flex justify="space-between" mb={4} align="center">
        <Flex align="center" gap={3}>
          <IconButton
            aria-label="Go back"
            variant="ghost"
            onClick={() => router.back()}
          >
            <GoArrowLeft />
          </IconButton>
          <Heading size="lg">
            <span style={{ color: primaryText_500 }}>Table:</span> {id}
          </Heading>
        </Flex>
      </Flex>
      {/* Main Table */}
      {id && (
        <CustomTable
          id={id}
          size="sm"
          paginationIncrement={30}
          borderColor={borderColor}
        />
      )}
      {tableReferences && Object.keys(tableReferences).length > 0 && (
        <div>
          <Text fontWeight="bold" fontSize="lg" mb={10}>
            Related Data
          </Text>
          <HStack
            direction="column"
            align="flex-start"
            justify="flex-start"
            width="100%"
            gap={4}
          >
            {tableReferences.map((ref, index) => {
              const key = ref.split("#");

              return (
                <Box key={index} width="100%">
                  <div style={{ display: "flex", columnGap: 20 }}>
                    <div>
                      <span>Table:</span> {key[0]}
                    </div>
                    <div>
                      Foreign Key: <span>{key[1]}</span>
                    </div>
                  </div>
                  <CustomTable
                    width="33vw"
                    id={ref}
                    size="sm"
                    paginationIncrement={20}
                    borderColor={borderColor}
                    isRelatedTable={true}
                  />
                </Box>
              );
            })}
          </HStack>
        </div>
      )}

      {/* Adding related data tables */}
    </Box>
  );
}
