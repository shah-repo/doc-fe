import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Autocomplete, FormikField } from '../../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { DEFAULT_OPTIONS, EDIT_FIELD, LCP_KEYS, PART_PURCHASE_OPTIONS } from '../constants';
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
  const isEditMode = dataItem[EDIT_FIELD] || dataItem.isAddPhase;
  const { getFieldProps, setFieldValue } = useFormikContext();

  const getOptions = () => {
    return field === LCP_KEYS.isAllowedToBuy ? PART_PURCHASE_OPTIONS : DEFAULT_OPTIONS;
  };

  const options = getOptions();
  const value = options.find((option) => option.value === dataItem[field]) ?? options[0];
  const datCy = `${kebabCase(field)}-td`;

  if (!isEditMode) {
    return <td data-cy={datCy}>{value?.label}</td>;
  }

  const handleChange = (e, value: OptionType) => {
    setFieldValue(field, value.value);
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
      data-cy={datCy}
    >
      <FormikField
        name={field}
      >
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          disabled={Mode.edit === dataItem[MODE_FIELD]}
          disableClearable
          placeholder={translate('common.select')}
          options={options}
          data-cy={`${kebabCase(field)}-field`}
          value={value}
          getOptionLabel={(option: OptionType) => option.label}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    </td>
  );
};
