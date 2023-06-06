import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getLogisticsCompanyById } from 'apiSdk/logistics-companies';
import { Error } from 'components/error';
import { LogisticsCompanyInterface } from 'interfaces/logistics-company';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteRouteById } from 'apiSdk/routes';
import { deleteShipmentById } from 'apiSdk/shipments';
import { deleteWarehouseById } from 'apiSdk/warehouses';

function LogisticsCompanyViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<LogisticsCompanyInterface>(
    () => (id ? `/logistics-companies/${id}` : null),
    () =>
      getLogisticsCompanyById(id, {
        relations: ['user', 'route', 'shipment', 'warehouse'],
      }),
  );

  const routeHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteRouteById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const shipmentHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteShipmentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const warehouseHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteWarehouseById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Logistics Company Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.name}
            </Text>
            <br />
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                    {data?.user?.email}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('route', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Routes:
                </Text>
                <NextLink passHref href={`/routes/create?logistics_company_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>origin</Th>
                        <Th>destination</Th>
                        <Th>distance</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.route?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.origin}</Td>
                          <Td>{record.destination}</Td>
                          <Td>{record.distance}</Td>
                          <Td>
                            <NextLink passHref href={`/routes/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/routes/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => routeHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('shipment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Shipments:
                </Text>
                <NextLink passHref href={`/shipments/create?logistics_company_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>tracking_number</Th>
                        <Th>status</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.shipment?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.tracking_number}</Td>
                          <Td>{record.status}</Td>
                          <Td>
                            <NextLink passHref href={`/shipments/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/shipments/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => shipmentHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('warehouse', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Warehouses:
                </Text>
                <NextLink passHref href={`/warehouses/create?logistics_company_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>name</Th>
                        <Th>location</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.warehouse?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.name}</Td>
                          <Td>{record.location}</Td>
                          <Td>
                            <NextLink passHref href={`/warehouses/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/warehouses/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => warehouseHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
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
  entity: 'logistics_company',
  operation: AccessOperationEnum.READ,
})(LogisticsCompanyViewPage);
