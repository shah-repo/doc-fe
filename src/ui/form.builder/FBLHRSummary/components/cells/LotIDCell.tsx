import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { EMPTY_PLACEHOLDER, LOT_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

export const LotIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const defaultValue = dataItem[field];
  let value = LOT_OPTIONS.find((option) => option.value === defaultValue);

  if (isEditMode) {
    const { values, getFieldProps, setFieldValue }
      = useFormikContext<EditableLHRSummaryItem>();

    const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
      setFieldValue(field, value?.value);
    };
    value = LOT_OPTIONS.find((option) => option.value === values[field]);
    return (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          disableClearable
          freeSolo
          forcePopupIcon
          options={LOT_OPTIONS}
          value={value}
          getOptionLabel={(option: OptionType) => option.label}
          onChange={handleChange}
          placeholder={translate('lhr.summary.placeholder.select.enter')}
          size="small"
        />
      </FormikField>
    );
  }

  return <>{value?.label ?? defaultValue ?? EMPTY_PLACEHOLDER}</>;
};
