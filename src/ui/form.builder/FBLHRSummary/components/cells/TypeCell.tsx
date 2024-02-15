import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { TYPE_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';

export const TypeCell: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };

  const defaultValue = isEditMode ? values.type : dataItem.type;
  const value = TYPE_OPTIONS.find((option) => option.value === defaultValue);

  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField
        name={field}
      >
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          disableClearable
          placeholder={translate('lhr.summary.placeholder.enter')}
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
