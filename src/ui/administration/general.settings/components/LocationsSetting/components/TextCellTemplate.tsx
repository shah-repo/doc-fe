import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { FormikField, TextField } from '../../../../../components/forms/fields-next';
import { EditableCompanyLocation } from '../../../panels/CompanyLocations/types';

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
  return (
    <OverflowTooltip
      title={defaultValue}
      arrow
      placement="top"
    >
      {defaultValue}
    </OverflowTooltip>
  );
};
