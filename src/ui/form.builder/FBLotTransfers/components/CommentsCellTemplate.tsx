import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../common/intl';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

export const CommentsCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return (
      <FormikField
        name={field}
      >
        <TextField
          {...getFieldProps(field)}
          autosize
          size="small"
          inputProps={{
            rowsMax: 5,
          }}
          placeholder={translate('form.builder.lot.transfers.comments')}
        />
      </FormikField>
    );
  }

  return <>{dataItem.comments ?? EMPTY_VALUE_PLACEHOLDER}</>;
};
