import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EDIT_FIELD, OPTIONS } from '../constants';
import { LCP } from '../types';

export const DropdownCell: React.FC<CellTemplateProps<LCP>> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  ...rest
}) => {
  const isEditMode = dataItem[EDIT_FIELD];
  const value = OPTIONS[0];
  // let value = OPTIONS.find((option) => option.value === dataItem.type);

  if (!isEditMode) {
    return <td>{value?.label}</td>;
  }

  // const { values, getFieldProps, setValues } = useFormikContext<LCP>();
  // value = OPTIONS.find((option) => option.value === values.type);
  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    console.log('value :', value);

    // setValues({
    //   ...values,
    //   lotStatus: '',
    //   expiryDate: null,
    //   lotOrEquipment: undefined,
    //   type: value?.value ?? '',
    // });
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-cy="cell-alternate-parts"
    >
      <FormikField name={field}>
        <Autocomplete
        // {...getFieldProps(field)}
        // key={isEmpty(values) ? 'disabled' : 'enabled'}
          blurOnSelect
          disabled={Mode.edit === dataItem[MODE_FIELD]}
          disableClearable
          placeholder={translate('common.select')}
          options={OPTIONS}
          value={value}
          getOptionLabel={(option: OptionType) => option.label}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    </td>
  );
};
