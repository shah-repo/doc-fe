import {
  DropDownList,
  DropDownListChangeEvent,
} from '@progress/kendo-react-dropdowns';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import * as React from 'react';
import { useIntl } from 'react-intl';
import {
  DisplayText,
  TranslatedText,
} from '../../../components/common/kendo/helpers';

interface DropdownFilterCellProps extends GridFilterCellProps {
  defaultItem: string
  data: string[]
}

export const DropdownFilterCell = ({
  defaultItem,
  onChange,
  value,
  data,
}: DropdownFilterCellProps) => {
  const intl = useIntl();
  const hasValue = (value: string) => value && value !== defaultItem;

  const onDropdownChange = ({ target, syntheticEvent }: DropDownListChangeEvent) => {
    const isValueExists = hasValue(target.value);
    onChange({
      value: isValueExists ? target.value : '',
      operator: isValueExists ? 'contains' : '',
      syntheticEvent,
    });
  };

  const onClearButtonClick = (event: React.MouseEvent) => {
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
        data={data.filter((el) => el).sort()}
        onChange={onDropdownChange}
        value={value || defaultItem}
        defaultItem={defaultItem}
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
