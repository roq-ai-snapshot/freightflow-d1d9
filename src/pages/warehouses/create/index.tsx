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
import { createWarehouse } from 'apiSdk/warehouses';
import { Error } from 'components/error';
import { warehouseValidationSchema } from 'validationSchema/warehouses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { LogisticsCompanyInterface } from 'interfaces/logistics-company';
import { getLogisticsCompanies } from 'apiSdk/logistics-companies';
import { WarehouseInterface } from 'interfaces/warehouse';

function WarehouseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WarehouseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWarehouse(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WarehouseInterface>({
    initialValues: {
      name: '',
      location: '',
      logistics_company_id: (router.query.logistics_company_id as string) ?? null,
      inventory: [],
    },
    validationSchema: warehouseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Warehouse
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'warehouse',
  operation: AccessOperationEnum.CREATE,
})(WarehouseCreatePage);
