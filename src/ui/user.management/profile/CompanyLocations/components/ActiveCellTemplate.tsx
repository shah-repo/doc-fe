import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Checkbox, FormikField } from '../../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../constants';
import { EditableCompanyLocation } from '../types';

export const ActiveCellTemplate: React.FC<CellTemplateProps<EditableCompanyLocation>> = ({ dataItem, field }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, getFieldMeta } = useFormikContext();

  return (
    <Box display="flex" justifyContent="center">
      {isEditMode && (
        <FormikField name={field}>
          <Checkbox
            checked={Boolean(getFieldMeta(field).value)}
            {...getFieldProps(field)}
          />
        </FormikField>
      )}
      {!isEditMode && (
        <Checkbox
          checked={dataItem.active}
          disabled
        />
      )}
    </Box>
  );
};
