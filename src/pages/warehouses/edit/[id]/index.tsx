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
import { getWarehouseById, updateWarehouseById } from 'apiSdk/warehouses';
import { Error } from 'components/error';
import { warehouseValidationSchema } from 'validationSchema/warehouses';
import { WarehouseInterface } from 'interfaces/warehouse';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { LogisticsCompanyInterface } from 'interfaces/logistics-company';
import { getLogisticsCompanies } from 'apiSdk/logistics-companies';
import { inventoryValidationSchema } from 'validationSchema/inventories';

function WarehouseEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WarehouseInterface>(
    () => (id ? `/warehouses/${id}` : null),
    () => getWarehouseById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: WarehouseInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateWarehouseById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<WarehouseInterface>({
    initialValues: data,
    validationSchema: warehouseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Warehouse
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="location" mb="4" isInvalid={!!formik.errors?.location}>
              <FormLabel>Location</FormLabel>
              <Input type="text" name="location" value={formik.values?.location} onChange={formik.handleChange} />
              {formik.errors.location && <FormErrorMessage>{formik.errors?.location}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<LogisticsCompanyInterface>
              formik={formik}
              name={'logistics_company_id'}
              label={'Select Logistics Company'}
              placeholder={'Select Logistics Company'}
              fetcher={getLogisticsCompanies}
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
  entity: 'warehouse',
  operation: AccessOperationEnum.UPDATE,
})(WarehouseEditPage);
