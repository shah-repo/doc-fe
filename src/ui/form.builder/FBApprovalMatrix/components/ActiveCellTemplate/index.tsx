import React from 'react';
import { get, set } from 'lodash';
import { DropDownList, DropDownListProps } from '@progress/kendo-react-dropdowns';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD, TEXT_FIELD, DATA_ITEM_KEY } from '../Grid';
import Status from './components/Status';
import { translate } from '../../../../../common/intl';

const DEFAULT_VALUE = true;

export default function ActiveCellTemplate<T> (props: CellTemplateProps<T>): React.ReactNode {
  const { dataItem, dataIndex, field, column, onChange } = props;
  const { editable } = column;

  const mode = dataItem[MODE_FIELD];
  const path = field ?? '';
  const value = get(dataItem, path);

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const renderValue: DropDownListProps['valueRender'] = (element, value) => (
    <Status value={value} />
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

  if (!canBeModified) {
    return <Status value={value} />;
  }

  return (
    <DropDownList
      data={[
        { [TEXT_FIELD]: translate('common.active'), [DATA_ITEM_KEY]: true },
        { [TEXT_FIELD]: translate('common.inactive'), [DATA_ITEM_KEY]: false },
      ]}
      textField={TEXT_FIELD}
      dataItemKey={DATA_ITEM_KEY}
      valueRender={renderValue}
      onChange={handleChange}
      defaultValue={DEFAULT_VALUE}
      value={value ?? DEFAULT_VALUE}
    />
  );
}
