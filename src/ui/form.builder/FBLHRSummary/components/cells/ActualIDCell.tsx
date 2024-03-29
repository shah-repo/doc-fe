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
import { EMPTY_PLACEHOLDER, LHR_SUMMARY_TYPE_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

export const ActualIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const defaultValue = dataItem[field];
  // TODO : need to rewrite method while doing integration
  let value = LHR_SUMMARY_TYPE_OPTIONS.find(
    (option) => option.value === defaultValue,
  );

  if (isEditMode) {
    const { values, getFieldProps, setFieldValue }
      = useFormikContext<EditableLHRSummaryItem>();
    value = LHR_SUMMARY_TYPE_OPTIONS.find(
      (option) => option.value === values[field],
    );

    const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
      // {id: 'enter value', revId: selectedValue, isNew: false}
      setFieldValue(field, value?.value ?? value);
    };
    return (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          freeSolo
          forcePopupIcon
          disableClearable
          options={LHR_SUMMARY_TYPE_OPTIONS}
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
