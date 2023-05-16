import {
  DropDownList,
  DropDownListChangeEvent,
  ListItemProps,
} from '@progress/kendo-react-dropdowns';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { map } from 'lodash';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { documentTypeSelectors } from '../../../../state/ducks/documentRevisions/documentType';
import { removeLastCharacterIfNotAlphaNumeric } from '../../../common/utils/helpers';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';

interface Props extends GridFilterCellProps {
  defaultItem: string;
  onStateChange?: (setDefault: boolean) => void;
}

export const DocumentTypeFilterTemplate = ({
  defaultItem,
  onChange,
  value: selectedVal,
}: Props) => {
  const documentTypeOptions = useSelector(documentTypeSelectors.getDocumentTypeOptionsForDocumentList);
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

  const valueRender = (element: React.ReactElement<HTMLSpanElement>, value: any) => {
    if (!value) {
      return element;
    }
    const children = [<span key={1}>{removeLastCharacterIfNotAlphaNumeric(value)}</span>];
    return React.cloneElement(element, { ...element.props }, children);
  };

  const itemRender = (li: React.ReactElement<HTMLSpanElement>, itemProps: ListItemProps) => {
    const itemChildren = (
      <span>
        {removeLastCharacterIfNotAlphaNumeric(itemProps.dataItem)}
      </span>
    );
    return React.cloneElement(li, li.props, itemChildren);
  };

  return (
    <div className="k-filtercell">
      <DropDownList
        data={map(documentTypeOptions, (item) => `${item.text}-`)}
        onChange={onDropdownChange}
        value={(selectedVal || defaultItem)}
        defaultItem={defaultItem}
        valueRender={valueRender}
        itemRender={itemRender}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        disabled={!hasValue(selectedVal)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
