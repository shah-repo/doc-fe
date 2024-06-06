import * as Yup from 'yup';
import { SystemHeaderEntity } from '../../../../state/ducks/bulkImport/types';

// Function to generate validation schema
export const createValidationSchema = (fields: SystemHeaderEntity[]) => {
  return Yup.object().shape(
    fields.reduce((acc, field) => {
      if (field.required) {
        acc[field.id] = Yup.string().required('common.required');
      }
      return acc;
    }, {}),
  );
};
