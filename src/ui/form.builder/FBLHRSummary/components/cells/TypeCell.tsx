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
  let value = TYPE_OPTIONS.find((option) => option.value === dataItem.type);

  if (!isEditMode) {
    return <>{value?.label}</>;
  }

  const { values, getFieldProps, setValues } = useFormikContext<EditableLHRSummaryItem>();
  value = TYPE_OPTIONS.find((option) => option.value === values.type);
  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setValues({
      ...values,
      lotStatus: '',
      expiryDate: null,
      lotOrEquipment: undefined,
      type: value?.value ?? '',
    });
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
        options={TYPE_OPTIONS}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};
