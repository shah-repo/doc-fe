import { makeStyles } from '@material-ui/core';
import { DropDownsPopupSettings, MultiSelect, MultiSelectProps } from '@progress/kendo-react-dropdowns';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { DATA_ITEM_KEY, Mode, MODE_FIELD, TEXT_FIELD } from './Grid';

interface ExtendedCellTemplateProps<T> extends CellTemplateProps<T> {
  data: any[]
  defaultItem?: any
  emptyLabel?: string
  popupSettings?: DropDownsPopupSettings
}

const Styles = makeStyles((theme) => ({
  dropDownContainer: {
    width: '100%',
    minWidth: 0,
  },
  dropdownParentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflow: 'visible',
    width: '100%',
  },
}));

const AllowedCreateDropdownCellTemplate: React.FC<ExtendedCellTemplateProps<any>> = (props) => {
  const { data, dataItem, emptyLabel = '-', field, dataIndex, column, onChange, onClick, popupSettings } = props;
  const { editable } = column;
  const classes = Styles();
  const mode = dataItem[MODE_FIELD];
  const path = field ?? '';
  const value: string[] = get(dataItem, path);

  const initialValueItems = data.filter((item) => value?.includes(item[DATA_ITEM_KEY]));

  const [selectedItems, setSelectedItems] = useState(initialValueItems);
  const [filter, setFilter] = useState('');

  const filteredData = data.filter((item) =>
    item[TEXT_FIELD]?.toLowerCase()?.includes(filter.toLowerCase()),
  );

  useEffect(() => {
    setSelectedItems(initialValueItems);
  }, [value]);

  const valueItems = data.filter((item) => value?.includes(item[DATA_ITEM_KEY]));
  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const handleChange: MultiSelectProps['onChange'] = (event) => {
    const updatedItems = event.target.value;
    setSelectedItems(updatedItems);

    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event.syntheticEvent,
      field,
      value: event.target.value.map((item) => item[DATA_ITEM_KEY]),
    });
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!onClick) {
      return;
    }
    event.stopPropagation();
    onClick({ dataItem });
  };

  if (!canBeModified) {
    const label = valueItems.length ? valueItems.map((item) => item[TEXT_FIELD]).join(', ') : emptyLabel;

    return (
      <div onClick={handleClick}>
        <OverflowTooltip
          arrow
          placement="top"
          title={label}
        >
          {label}
        </OverflowTooltip>
      </div>);
  }

  return (
    <div className={classes.dropdownParentContainer}>
      <MultiSelect
        className={classes.dropDownContainer}
        data={filteredData}
        textField={TEXT_FIELD}
        dataItemKey={DATA_ITEM_KEY}
        onChange={handleChange}
        value={selectedItems}
        popupSettings={popupSettings}
        filterable
        filter={filter}
        onFilterChange={(event) => {
          setFilter(event.filter.value);
        }}
      />
    </div>
  );
};

export default AllowedCreateDropdownCellTemplate;
