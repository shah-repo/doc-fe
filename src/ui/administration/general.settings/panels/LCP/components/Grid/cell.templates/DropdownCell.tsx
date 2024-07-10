import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Autocomplete } from '../../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EDIT_FIELD, OPTIONS } from '../constants';
import { LCP } from '../types';

export const DropdownCell: React.FC<CellTemplateProps<LCP>> = ({
  dataItem,
  field,
  colSpan,
  dataIndex,
  style,
  className,
  onChange,
  ...rest
}) => {
  const isEditMode = dataItem[EDIT_FIELD];
  const value = OPTIONS.find((option) => option.value === dataItem[field]) ?? OPTIONS[0];

  if (!isEditMode) {
    return <td>{value?.label}</td>;
  }

  const handleChange = (e, value) => {
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: e.syntheticEvent,
      field,
      value: value.value,
    });
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-cy="cell-alternate-parts"
    >
      <Autocomplete
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
    </td>
  );
};
