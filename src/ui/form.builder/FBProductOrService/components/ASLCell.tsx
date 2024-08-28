import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../common/intl';
import {
  Autocomplete,
  FormikField,
} from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import {
  Mode, MODE_FIELD,
} from '../../../components/KendoDataGrid/constants';
import { ASL_STATUS_OPTIONS } from '../constants';
import { CustomTemplateProps, EditableProductORService } from '../types';

export const ASLCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  let value = ASL_STATUS_OPTIONS.find((option) => option.value === dataItem[field]);

  if (!isEditMode) {
    return <>{value?.label}</>;
  }

  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableProductORService>();
  value = ASL_STATUS_OPTIONS.find((option) => option.value === values[field]);
  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value ?? '');
  };

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        blurOnSelect
        disabled={Mode.edit === dataItem[MODE_FIELD]}
        disableClearable
        placeholder={translate('common.select')}
        options={ASL_STATUS_OPTIONS}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};
