import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getRouteById } from 'apiSdk/routes';
import { Error } from 'components/error';
import { RouteInterface } from 'interfaces/route';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function RouteViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RouteInterface>(
    () => (id ? `/routes/${id}` : null),
    () =>
      getRouteById(id, {
        relations: ['logistics_company'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Route Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Origin:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.origin}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Destination:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.destination}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Distance:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.distance}
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
  entity: 'route',
  operation: AccessOperationEnum.READ,
})(RouteViewPage);
