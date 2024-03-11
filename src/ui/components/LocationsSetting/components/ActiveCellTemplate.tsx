import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { CellTemplateProps } from '../../KendoDataGrid/KendoDataGrid.types';
import { Checkbox, FormikField } from '../../forms/fields-next';
import { EditableCompanyLocation } from '../../../user.management/profile/CompanyLocations/types';
import { Mode, MODE_FIELD } from '../../KendoDataGrid/constants';

export const ActiveCellTemplate: React.FC<CellTemplateProps<EditableCompanyLocation>> = ({ dataItem, field, onClick }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
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
        <div onClick={() => onClick?.({ dataItem })}>
          <Checkbox
            checked={dataItem.active}
            disabled
          />
        </div>
      )}
    </Box>
  );
};
