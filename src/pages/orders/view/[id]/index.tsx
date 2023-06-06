import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getOrderById } from 'apiSdk/orders';
import { Error } from 'components/error';
import { OrderInterface } from 'interfaces/order';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function OrderViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OrderInterface>(
    () => (id ? `/orders/${id}` : null),
    () =>
      getOrderById(id, {
        relations: ['customer', 'supplier'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Order Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Order Number:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.order_number}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Status:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.status}
            </Text>
            <br />
            {hasAccess('customer', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Customer:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/customers/view/${data?.customer?.id}`}>
                    {data?.customer?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('supplier', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Supplier:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/suppliers/view/${data?.supplier?.id}`}>
                    {data?.supplier?.name}
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
  entity: 'order',
  operation: AccessOperationEnum.READ,
})(OrderViewPage);
