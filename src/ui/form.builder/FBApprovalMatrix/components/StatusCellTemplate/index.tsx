import { DropDownList, DropDownListProps, DropDownsPopupSettings } from '@progress/kendo-react-dropdowns';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBApprovalMatrixItem } from '../../../FBApprovalMatrixField/FBApprovalMatrixField.types';
import { createOption, DATA_ITEM_KEY, Mode, MODE_FIELD, TEXT_FIELD } from '../Grid';
import Status from './components/Status';

interface StatusCellTemplateProps<T> extends CellTemplateProps<T> {
  popupSettings?: DropDownsPopupSettings
}

const StatusCellTemplate: React.FC<StatusCellTemplateProps<FBApprovalMatrixItem>> = (props) => {
  const { dataItem, dataIndex, field, column, onChange, popupSettings } = props;
  const { editable } = column;

  const mode = get(dataItem, MODE_FIELD);
  const path = field ?? '';
  const value = get(dataItem, path);

  const data = [
    createOption(true, translate('common.active')),
    createOption(false, translate('common.inactive')),
  ];

  const valueItem = data.find((item) => item[DATA_ITEM_KEY] === value);

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const renderValue: DropDownListProps['valueRender'] = (element, value) => (
    <Status value={value[DATA_ITEM_KEY]} />
  );

  const handleChange: DropDownListProps['onChange'] = (event) => {
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event.syntheticEvent,
      field,
      value: event.value[DATA_ITEM_KEY],
    });
  };

  // Empty for deprecated documents.
  if (value === undefined) {
    return <>-</>;
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
      popupSettings={popupSettings}
    />
  );
};

export default StatusCellTemplate;
