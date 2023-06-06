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
import { getRouteById, updateRouteById } from 'apiSdk/routes';
import { Error } from 'components/error';
import { routeValidationSchema } from 'validationSchema/routes';
import { RouteInterface } from 'interfaces/route';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { LogisticsCompanyInterface } from 'interfaces/logistics-company';
import { getLogisticsCompanies } from 'apiSdk/logistics-companies';

function RouteEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RouteInterface>(
    () => (id ? `/routes/${id}` : null),
    () => getRouteById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RouteInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRouteById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RouteInterface>({
    initialValues: data,
    validationSchema: routeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Route
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="origin" mb="4" isInvalid={!!formik.errors?.origin}>
              <FormLabel>Origin</FormLabel>
              <Input type="text" name="origin" value={formik.values?.origin} onChange={formik.handleChange} />
              {formik.errors.origin && <FormErrorMessage>{formik.errors?.origin}</FormErrorMessage>}
            </FormControl>
            <FormControl id="destination" mb="4" isInvalid={!!formik.errors?.destination}>
              <FormLabel>Destination</FormLabel>
              <Input type="text" name="destination" value={formik.values?.destination} onChange={formik.handleChange} />
              {formik.errors.destination && <FormErrorMessage>{formik.errors?.destination}</FormErrorMessage>}
            </FormControl>
            <FormControl id="distance" mb="4" isInvalid={!!formik.errors?.distance}>
              <FormLabel>Distance</FormLabel>
              <NumberInput
                name="distance"
                value={formik.values?.distance}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('distance', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.distance && <FormErrorMessage>{formik.errors?.distance}</FormErrorMessage>}
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
  entity: 'route',
  operation: AccessOperationEnum.UPDATE,
})(RouteEditPage);
