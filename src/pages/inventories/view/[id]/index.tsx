import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getInventoryById } from 'apiSdk/inventories';
import { Error } from 'components/error';
import { InventoryInterface } from 'interfaces/inventory';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function InventoryViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InventoryInterface>(
    () => (id ? `/inventories/${id}` : null),
    () =>
      getInventoryById(id, {
        relations: ['warehouse'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Inventory Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Product Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.product_name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Quantity:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.quantity}
            </Text>
            <br />
            {hasAccess('warehouse', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Warehouse:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/warehouses/view/${data?.warehouse?.id}`}>
                    {data?.warehouse?.name}
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
  entity: 'inventory',
  operation: AccessOperationEnum.READ,
})(InventoryViewPage);
