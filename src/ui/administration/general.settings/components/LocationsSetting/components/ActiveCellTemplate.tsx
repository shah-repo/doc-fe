import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { Checkbox, FormikField } from '../../../../../components/forms/fields-next';
import { EditableCompanyLocation } from '../../../panels/CompanyLocations/types';

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
