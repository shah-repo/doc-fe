import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../../../common/intl';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { Checkbox, FormikField } from '../../../../../components/forms/fields-next';
import { EditableCompanyLocation } from '../../../panels/CompanyLocations/types';

export const IncludedInTotalQtyCellTemplate: React.FC<CellTemplateProps<EditableCompanyLocation>> = ({ dataItem, field, onClick }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const { getFieldProps, getFieldMeta } = useFormikContext();

  const displayValue = translate(dataItem.includedInTotalQty ? 'common.true' : 'common.false');

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
          {displayValue}
        </div>
      )}
    </Box>
  );
};
