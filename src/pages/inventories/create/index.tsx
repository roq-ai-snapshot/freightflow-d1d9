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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createInventory } from 'apiSdk/inventories';
import { Error } from 'components/error';
import { inventoryValidationSchema } from 'validationSchema/inventories';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { WarehouseInterface } from 'interfaces/warehouse';
import { getWarehouses } from 'apiSdk/warehouses';
import { InventoryInterface } from 'interfaces/inventory';

function InventoryCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InventoryInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInventory(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InventoryInterface>({
    initialValues: {
      product_name: '',
      quantity: 0,
      warehouse_id: (router.query.warehouse_id as string) ?? null,
    },
    validationSchema: inventoryValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Inventory
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="product_name" mb="4" isInvalid={!!formik.errors?.product_name}>
            <FormLabel>Product Name</FormLabel>
            <Input type="text" name="product_name" value={formik.values?.product_name} onChange={formik.handleChange} />
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'inventory',
  operation: AccessOperationEnum.CREATE,
})(InventoryCreatePage);
