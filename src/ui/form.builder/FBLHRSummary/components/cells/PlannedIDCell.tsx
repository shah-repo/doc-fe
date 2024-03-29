import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import {
  MODE_FIELD,
  Mode,
} from '../../../../components/KendoDataGrid/constants';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { EMPTY_PLACEHOLDER, LHR_SUMMARY_TYPE_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

export const PlannedIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const defaultValue = dataItem[field];
  let value = LHR_SUMMARY_TYPE_OPTIONS.find(
    (option) => option.value === defaultValue,
  );

  if (isEditMode) {
    const { values, getFieldProps, setFieldValue }
      = useFormikContext<EditableLHRSummaryItem>();

    const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
      setFieldValue(field, value?.value ?? value);
    };
    value = LHR_SUMMARY_TYPE_OPTIONS.find(
      (option) => option.value === values[field],
    );
    return (
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          key={isEmpty(values) ? 'disabled' : 'enabled'}
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
