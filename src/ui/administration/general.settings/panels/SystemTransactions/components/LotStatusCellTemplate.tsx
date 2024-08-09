import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { getLotStatusLabel } from '../../../../../components/common/header/HeaderLotStatus';
import { Autocomplete, FormikField } from '../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { TRANSFER_TYPE_OPTIONS } from '../../../../../form.builder/FBLotTransfers/constants';
import useStyles from '../styles';
import { EditableSystemTransactionsRule } from '../types';

const EMPTY_VALUE_PLACEHOLDER = '-';

export const LotStatusCellTemplate: React.FC<CellTemplateProps<EditableSystemTransactionsRule>> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps } = useFormikContext<EditableSystemTransactionsRule>();
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    // setFieldValue(field, value?.value);
  };

  const defaultValue = dataItem.lotStatus;
  const value = defaultValue ? getLotStatusLabel(defaultValue) : EMPTY_VALUE_PLACEHOLDER;

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

  return <>{value}</>;
};
