// pages/table/[id].tsx
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GoArrowLeft } from "react-icons/go";
import { primaryText_200, primaryText_500 } from "@/common/styles";
import { CustomTable } from "@/components/customTable";

export default function TableDetailPage() {
  const router = useRouter();
  const { id } = router.query;

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
          paginationIncrement={10}
          borderColor={borderColor}
        />
      )}
      {/* Adding related data tables */}
    </Box>
  );
}
