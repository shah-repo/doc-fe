import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { CellTemplateProps } from '../../KendoDataGrid/KendoDataGrid.types';
import { FormikField, TextField } from '../../forms/fields-next';
import { EditableCompanyLocation } from '../../../user.management/profile/CompanyLocations/types';
import { MODE_FIELD, Mode } from '../../KendoDataGrid/constants';

export const TextCellTemplate: React.FC<CellTemplateProps<EditableCompanyLocation>> = ({ dataItem, field }) => {
  const { getFieldProps } = useFormikContext();

  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = get(dataItem, field, '') as string;

  if (isEditMode) {
    return (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)} />
      </FormikField>
    );
  }
  return <>{defaultValue}</>;
};
