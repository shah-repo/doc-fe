import { DropDownList, DropDownListProps } from '@progress/kendo-react-dropdowns';
import { get, set } from 'lodash';
import React from 'react';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../components/OverflowTooltip';

import { DATA_ITEM_KEY, Mode, MODE_FIELD, TEXT_FIELD } from '../Grid';

interface ExtendedCellTemplateProps<T> extends CellTemplateProps<T> {
  data: any[]
  defaultItem?: any
}

const DropdownCellTemplate: React.FC<ExtendedCellTemplateProps<any>> = (props) => {
  const { data, dataItem, defaultItem, field, dataIndex, column, onChange } = props;
  const { editable } = column;

  const mode = dataItem[MODE_FIELD];
  const path = field ?? '';
  const value = get(dataItem, path);

  const valueItem = data.find((item) => item[DATA_ITEM_KEY] === value);

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const handleChange: DropDownListProps['onChange'] = (event) => {
    const newValue = event.target.value[DATA_ITEM_KEY];
    console.log('--handleChange--');

    onChange?.({
      dataIndex,
      dataItem: set(dataItem as Record<string, unknown>, path, newValue),
      syntheticEvent: event.syntheticEvent,
      field,
      value: newValue,
    });
  };

  if (!canBeModified) {
    return (<OverflowTooltip
      arrow
      placement="top"
      title={valueItem?.[TEXT_FIELD]}
    > {valueItem?.[TEXT_FIELD] ?? '-'}
    </OverflowTooltip>);
  }

  return (
    <DropDownList
      data={data}
      textField={TEXT_FIELD}
      dataItemKey={DATA_ITEM_KEY}
      defaultItem={defaultItem}
      onChange={handleChange}
      defaultValue={valueItem ?? defaultItem}
    />
  );
};

export default DropdownCellTemplate;
