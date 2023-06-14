import {
  DropDownList,
  DropDownListChangeEvent,
} from '@progress/kendo-react-dropdowns';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';
import { documentRevisionEffectiveDateOption } from '../../utils/helpers';

interface Props extends GridFilterCellProps {
  defaultItem: string
}

export const EffectiveDateFilterTemplate = ({
  defaultItem,
  onChange,
  value,
}: Props) => {
  const data = documentRevisionEffectiveDateOption();
  const hasValue = (value: string) => value && value !== defaultItem;
  const intl = useIntl();
  const onDropdownChange = ({ target, syntheticEvent }: DropDownListChangeEvent) => {
    const isValueExists = hasValue(target.value);
    onChange({
      value: isValueExists ? target.value : '',
      operator: isValueExists ? 'eq' : '',
      syntheticEvent,
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
        data={data.map((el) => el.text)}
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
