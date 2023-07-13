import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { TRANSFER_TYPE_OPTIONS } from '../constants';
import { CustomTemplateProps, EditableLotTransfer } from '../types';

export const TransferTypeCellTemplate: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLotTransfer>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };

  const defaultValue = isEditMode ? values.type : dataItem.type;
  const value = TRANSFER_TYPE_OPTIONS.find((option) => option.value === defaultValue);

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField
        name={field}
        required
      >
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          disableClearable
          options={TRANSFER_TYPE_OPTIONS}
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
