import { makeStyles } from '@material-ui/core';
import { DropDownList, DropDownListProps } from '@progress/kendo-react-dropdowns';
import { get } from 'lodash';
import React from 'react';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { DATA_ITEM_KEY, MODE_FIELD, Mode, TEXT_FIELD } from '../Grid';

interface ExtendedCellTemplateProps<T> extends CellTemplateProps<T> {
  data: any[]
  defaultItem?: any
  emptyLabel?: string
}

const Styles = makeStyles(() => ({
  dropDownContainer: {
    width: '100%',
  },
}));

const DropdownCellTemplate: React.FC<ExtendedCellTemplateProps<any>> = (props) => {
  const { data, dataItem, defaultItem, emptyLabel = '-', field, dataIndex, column, onChange } = props;
  const { editable } = column;
  const classes = Styles();
  const mode = dataItem[MODE_FIELD];
  const path = field ?? '';
  const value = get(dataItem, path);

  const valueItem = data.find((item) => item[DATA_ITEM_KEY] === value);

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const handleChange: DropDownListProps['onChange'] = (event) => {
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event.syntheticEvent,
      field,
      value: event.target.value[DATA_ITEM_KEY],
    });
  };

  if (!canBeModified) {
    const label = valueItem?.[TEXT_FIELD] ?? emptyLabel;

    return (
      <OverflowTooltip
        arrow
        placement="top"
        title={label}
      >
        {label}
      </OverflowTooltip>);
  }

  return (
    <DropDownList
      className={classes.dropDownContainer}
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
