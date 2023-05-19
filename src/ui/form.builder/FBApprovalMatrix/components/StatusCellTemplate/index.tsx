import React from 'react';
import { get, set } from 'lodash';
import { DropDownList, DropDownListProps } from '@progress/kendo-react-dropdowns';
import { CellTemplate } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD, TEXT_FIELD, DATA_ITEM_KEY } from '../Grid';
import Status from './components/Status';
import { translate } from '../../../../../common/intl';

const StatusCellTemplate: CellTemplate = (props) => {
  const { dataItem, dataIndex, field, column, onChange } = props;
  const { editable } = column;

  const mode = get(dataItem, MODE_FIELD);
  const path = field ?? '';
  const value = get(dataItem, path);

  const data = [
    { [DATA_ITEM_KEY]: true, [TEXT_FIELD]: translate('common.active') },
    { [DATA_ITEM_KEY]: false, [TEXT_FIELD]: translate('common.inactive') },
  ];

  const valueItem = data.find((item) => item[DATA_ITEM_KEY] === value);

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const renderValue: DropDownListProps['valueRender'] = (element, value) => (
    <Status value={value[DATA_ITEM_KEY]} />
  );

  const handleChange: DropDownListProps['onChange'] = (event) => {
    const newValue = event.value[DATA_ITEM_KEY];

    onChange?.({
      dataIndex,
      dataItem: set(dataItem as Record<string, unknown>, path, newValue),
      syntheticEvent: event.syntheticEvent,
      field,
      value: newValue,
    });
  };

  // Empty for deprecated documents.
  if (value === undefined) {
    return '-';
  }

  if (!canBeModified) {
    return <Status value={value} />;
  }

  return (
    <DropDownList
      data={data}
      textField={TEXT_FIELD}
      dataItemKey={DATA_ITEM_KEY}
      valueRender={renderValue}
      onChange={handleChange}
      defaultValue={valueItem}
    />
  );
};

export default StatusCellTemplate;
