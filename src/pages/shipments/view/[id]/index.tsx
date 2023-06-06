import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getShipmentById } from 'apiSdk/shipments';
import { Error } from 'components/error';
import { ShipmentInterface } from 'interfaces/shipment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ShipmentViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ShipmentInterface>(
    () => (id ? `/shipments/${id}` : null),
    () =>
      getShipmentById(id, {
        relations: ['logistics_company'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Shipment Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Tracking Number:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.tracking_number}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Status:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.status}
            </Text>
            <br />
            {hasAccess('logistics_company', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Logistics Company:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/logistics-companies/view/${data?.logistics_company?.id}`}>
                    {data?.logistics_company?.name}
                  </Link>
                </Text>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'shipment',
  operation: AccessOperationEnum.READ,
})(ShipmentViewPage);
