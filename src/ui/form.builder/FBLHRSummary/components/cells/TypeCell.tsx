import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode, MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { TYPE_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

export const TypeCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const defaultValue = dataItem.type;
  let value = TYPE_OPTIONS.find((option) => option.value === defaultValue);

  if (isEditMode) {
    const { values, getFieldProps, setFieldValue }
      = useFormikContext<EditableLHRSummaryItem>();

    const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
      setFieldValue(field, value?.value);
    };
    value = TYPE_OPTIONS.find((option) => option.value === values.type);

    return (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          key={isEmpty(values) ? 'disabled' : 'enabled'}
          blurOnSelect
          disabled={Mode.edit === dataItem[MODE_FIELD]}
          disableClearable
          placeholder={translate('common.select')}
          options={TYPE_OPTIONS}
          value={value}
          getOptionLabel={(option: OptionType) => option.label}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    );
  }

  return <>{value?.label}</>;
};
