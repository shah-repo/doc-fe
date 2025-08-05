import { DropDownList, DropDownListChangeEvent, ListItemProps } from '@progress/kendo-react-dropdowns';
import React from 'react';
import { ASLTruncatedTooltipText } from '../../../administration/general.settings/panels/SupplierSettings/ASLStatus/components/ASLTruncatedTooltipText';
import Filter from '../../FBApprovalMatrix/components/Filter';
import { DATA_ITEM_KEY, TEXT_FIELD } from '../constants';
import useStyles from '../styles';
import { DropdownFilterCellProps, Item } from '../types';

const SupplierStateFilterCellTemplate: React.FC<DropdownFilterCellProps> = (props) => {
  const { data, value, operator = 'eq', defaultItem, defaultValue, onChange, disabled } = props;
  const classes = useStyles();

  const handleChange = (event: DropDownListChangeEvent) => {
    const newValue = event.target.value[DATA_ITEM_KEY];

    if (newValue === value) {
      return;
    }

    onChange({
      value: newValue,
      operator,
      syntheticEvent: event.syntheticEvent,
    });
  };

  const valueRender = (_: React.ReactElement<HTMLSpanElement>, value: Item): React.ReactNode => {
    return (
      <div className={classes.statusFilterOptionCell}>
        <ASLTruncatedTooltipText text={value?.[TEXT_FIELD] || ''} />
      </div>
    );
  };

  const itemRender = (li: React.ReactElement<HTMLLIElement>, itemProps: ListItemProps): React.ReactNode => {
    const text = itemProps.dataItem[TEXT_FIELD] || '';

    return React.cloneElement(li, { ...li.props, title: text }, <ASLTruncatedTooltipText text={text} />);
  };

  return (
    <Filter {...props}>
      <DropDownList
        data={data}
        textField={TEXT_FIELD}
        dataItemKey={DATA_ITEM_KEY}
        onChange={handleChange}
        defaultItem={defaultItem}
        defaultValue={defaultValue}
        value={data.find((item) => item[DATA_ITEM_KEY] === value) ?? defaultItem}
        disabled={disabled}
        itemRender={itemRender}
        valueRender={valueRender}
      />
    </Filter>
  );
};

export default SupplierStateFilterCellTemplate;
