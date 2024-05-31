import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { EditableCompanyLocation } from '../../../user.management/profile/CompanyLocations/types';
import { FormikField, TextField } from '../../forms/fields-next';
import { Mode, MODE_FIELD } from '../../KendoDataGrid/constants';
import { CellTemplateProps } from '../../KendoDataGrid/KendoDataGrid.types';

export const TextCellTemplate: React.FC<CellTemplateProps<EditableCompanyLocation>> = ({ dataItem, field, isNameDisable = false }) => {
  const { getFieldProps } = useFormikContext();

  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = get(dataItem, field, '') as string;

  if (isEditMode) {
    return (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)}
          disabled={isNameDisable} />
      </FormikField>
    );
  }
  return <>{defaultValue}</>;
};
