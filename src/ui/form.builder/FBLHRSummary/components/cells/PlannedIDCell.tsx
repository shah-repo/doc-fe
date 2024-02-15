import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { LHR_SUMMARY_TYPE_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

export const PlannedIDCell: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value ?? value);
  };

  const defaultValue = isEditMode ? values[field] : dataItem[field];
  const value = LHR_SUMMARY_TYPE_OPTIONS.find((option) => option.value === defaultValue);

  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField
        name={field}
      >
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
          onInputChange={handleChange}
          placeholder={translate('lhr.summary.placeholder.select.enter')}
          size="small"
        />
      </FormikField>
    );
  }

  return <>{value?.label ?? defaultValue}</>;
};
