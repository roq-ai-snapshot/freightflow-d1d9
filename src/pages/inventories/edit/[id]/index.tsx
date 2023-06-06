import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getInventoryById, updateInventoryById } from 'apiSdk/inventories';
import { Error } from 'components/error';
import { inventoryValidationSchema } from 'validationSchema/inventories';
import { InventoryInterface } from 'interfaces/inventory';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { WarehouseInterface } from 'interfaces/warehouse';
import { getWarehouses } from 'apiSdk/warehouses';

function InventoryEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InventoryInterface>(
    () => (id ? `/inventories/${id}` : null),
    () => getInventoryById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InventoryInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInventoryById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InventoryInterface>({
    initialValues: data,
    validationSchema: inventoryValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Inventory
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="product_name" mb="4" isInvalid={!!formik.errors?.product_name}>
              <FormLabel>Product Name</FormLabel>
              <Input
                type="text"
                name="product_name"
                value={formik.values?.product_name}
                onChange={formik.handleChange}
              />
              {formik.errors.product_name && <FormErrorMessage>{formik.errors?.product_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="quantity" mb="4" isInvalid={!!formik.errors?.quantity}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput
                name="quantity"
                value={formik.values?.quantity}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('quantity', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.quantity && <FormErrorMessage>{formik.errors?.quantity}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<WarehouseInterface>
              formik={formik}
              name={'warehouse_id'}
              label={'Select Warehouse'}
              placeholder={'Select Warehouse'}
              fetcher={getWarehouses}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'inventory',
  operation: AccessOperationEnum.UPDATE,
})(InventoryEditPage);
