import React from 'react';
import { Autocomplete, FormikField } from '../../../../../../forms/fields-next';
import { CustomTemplateProps } from '../types';

export const UnitsCellTemplate: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  return (
    <FormikField name={field}>
      <Autocomplete options={[dataItem[field]]} value={dataItem[field]} size="small" disabled />
    </FormikField>
  );
};
