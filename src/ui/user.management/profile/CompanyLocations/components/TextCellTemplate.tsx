import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import { EditableCompanyLocation } from '../types';

export const TextCellTemplate: React.FC<CellTemplateProps<EditableCompanyLocation>> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
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
