import {
  DropDownList,
  DropDownListChangeEvent,
} from '@progress/kendo-react-dropdowns';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { useIntl } from 'react-intl';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';

interface SelectedItemProps {
  text: string;
  value: string | boolean;
}
interface StateChangeProps {
  selectedItem?: SelectedItemProps ;
  parentField: string | undefined;
}
interface DropdownFilterCellProps extends GridFilterCellProps {
  defaultItem: {
    text: string;
    value: string;
  };
  defaultValue?: {
    text: string;
    value: string;
  };
  data: {
    text: string;
    value: string | boolean;
  }[];
  customOperator?: string;
  onStateChange?: (data: StateChangeProps) => void;
}

export const DropdownFilterTemplate = ({
  defaultItem,
  data,
  field,
  onStateChange,
  defaultValue,
  onChange,
  customOperator,
  value,
}: DropdownFilterCellProps) => {
  const intl = useIntl();
  const [state, setState] = React.useState({
    value: defaultItem,
  });
  const hasValue = (value: { text: string; value: string }) => value && value !== defaultItem;
  const onDropdownChange = ({ target, syntheticEvent }: DropDownListChangeEvent) => {
    const selectedItem = data.find((dd) => dd.text === target.value.text);
    const isValueExists = hasValue(target.value);
    setState({
      value: target.value,
    });
    onChange({
      value: isValueExists ? selectedItem?.value : '',
      operator: isValueExists ? customOperator || 'eq' : '',
      syntheticEvent,
    });
    onStateChange && onStateChange({ selectedItem, parentField: field });
  };

  const onClearButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onChange({
      value: '',
      operator: '',
      syntheticEvent: event,
    });
    setState({
      value: defaultItem,
    });
    onStateChange && onStateChange({ parentField: field });
  };
  return (
    <div className="k-filtercell">
      <DropDownList
        data={data}
        textField="text"
        dataItemKey="value"
        onChange={onDropdownChange}
        defaultItem={defaultItem}
        defaultValue={state.value}
        value={data.find((dd) => dd.value === value) || defaultItem}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        onClick={onClearButtonClick}
        disabled={(value === '' || value === null)}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
