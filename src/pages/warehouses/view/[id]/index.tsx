import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getWarehouseById } from 'apiSdk/warehouses';
import { Error } from 'components/error';
import { WarehouseInterface } from 'interfaces/warehouse';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteInventoryById } from 'apiSdk/inventories';

function WarehouseViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WarehouseInterface>(
    () => (id ? `/warehouses/${id}` : null),
    () =>
      getWarehouseById(id, {
        relations: ['logistics_company', 'inventory'],
      }),
  );

  const inventoryHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteInventoryById(id);
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
        Warehouse Detail View
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
            <Text fontSize="lg" fontWeight="bold" as="span">
              Location:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.location}
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
            {hasAccess('inventory', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Inventories:
                </Text>
                <NextLink passHref href={`/inventories/create?warehouse_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>product_name</Th>
                        <Th>quantity</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.inventory?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.product_name}</Td>
                          <Td>{record.quantity}</Td>
                          <Td>
                            <NextLink passHref href={`/inventories/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/inventories/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => inventoryHandleDelete(record.id)}>Delete</Button>
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
  entity: 'warehouse',
  operation: AccessOperationEnum.READ,
})(WarehouseViewPage);
