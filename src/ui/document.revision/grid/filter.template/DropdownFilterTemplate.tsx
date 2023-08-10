import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import React from 'react';
import { intl } from '../../../../common/intl';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';
import { DropdownFilterCellProps } from '../../../form.builder/FBApprovalMatrix/components/DropdownFilter/types';
import { DATA_ITEM_KEY, TEXT_FIELD } from '../../../form.builder/FBApprovalMatrix/components/Grid';
// import { DropdownFilterCellProps } from './types';
// import { DATA_ITEM_KEY, TEXT_FIELD } from '../Grid';

const LotStatusFilterTemplate: React.FC<DropdownFilterCellProps> = (props) => {
  const {
    data,
    value,
    operator = 'eq',
    defaultItem,
    defaultValue,
    onChange,
    disabled,
  } = props;

  const hasValue = (value: string) => value && value !== defaultItem;

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

  const onClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange({
      value: '',
      operator: '',
      syntheticEvent: event,
    });
  };

  return (
    <div className="k-filtercell">
      <DropDownList
        data={data}
        textField={TEXT_FIELD}
        dataItemKey={DATA_ITEM_KEY}
        onChange={handleChange}
        defaultItem={defaultItem}
        defaultValue={defaultValue}
        value={data.find((item) => item[DATA_ITEM_KEY] === value) ?? defaultItem}
        disabled={disabled}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        disabled={!hasValue(value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};

export default LotStatusFilterTemplate;
