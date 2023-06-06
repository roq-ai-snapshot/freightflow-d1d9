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
import { createShipment } from 'apiSdk/shipments';
import { Error } from 'components/error';
import { shipmentValidationSchema } from 'validationSchema/shipments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { LogisticsCompanyInterface } from 'interfaces/logistics-company';
import { getLogisticsCompanies } from 'apiSdk/logistics-companies';
import { ShipmentInterface } from 'interfaces/shipment';

function ShipmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ShipmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createShipment(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ShipmentInterface>({
    initialValues: {
      tracking_number: '',
      status: '',
      logistics_company_id: (router.query.logistics_company_id as string) ?? null,
    },
    validationSchema: shipmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Shipment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="tracking_number" mb="4" isInvalid={!!formik.errors?.tracking_number}>
            <FormLabel>Tracking Number</FormLabel>
            <Input
              type="text"
              name="tracking_number"
              value={formik.values?.tracking_number}
              onChange={formik.handleChange}
            />
            {formik.errors.tracking_number && <FormErrorMessage>{formik.errors?.tracking_number}</FormErrorMessage>}
          </FormControl>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
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
  entity: 'shipment',
  operation: AccessOperationEnum.CREATE,
})(ShipmentCreatePage);
