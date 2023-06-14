import { Input, InputProps } from '@progress/kendo-react-inputs';
import { debounce, get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { CellTemplate } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { Mode, MODE_FIELD } from '../Grid';

const InputCellTemplate: CellTemplate = (props) => {
  const { dataItem, field, dataIndex, column, onChange } = props;
  const { title, editable } = column;

  const mode = get(dataItem, MODE_FIELD);
  const path = field ?? '';
  const value = String(get(dataItem, path) ?? '');

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const handleChange: InputProps['onChange'] = debounce(
    (event) => {
      onChange?.({
        dataIndex,
        dataItem,
        syntheticEvent: event.syntheticEvent,
        field,
        value: event.value,
      });
    },
    500,
  );

  if (!canBeModified) {
    return (
      <OverflowTooltip
        arrow
        placement="top"
        title={value ?? ''}
      >
        {value || '-'}
      </OverflowTooltip>);
  }

  return (
    <Input
      placeholder={translate(title)}
      defaultValue={value}
      onChange={handleChange}
    />
  );
};

export default InputCellTemplate;
