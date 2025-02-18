import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { TRANSFER_TYPE_OPTIONS } from '../../../../../form.builder/FBLotTransfers/constants';
import useStyles from '../styles';
import { EditableSystemTransactionsRule } from '../types';

export const TransferTypeCellTemplate: React.FC<CellTemplateProps<EditableSystemTransactionsRule>> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableSystemTransactionsRule>();
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };

  const defaultValue = isEditMode ? values.action : dataItem.action;
  const value = TRANSFER_TYPE_OPTIONS.find(option => option.value === defaultValue);

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
          classes={{
            root: classes.inputRoot,
          }}
        />
      </FormikField>
    );
  }

  return <>{value?.label}</>;
};
