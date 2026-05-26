import { MultiSelect, MultiSelectChangeEvent } from '@progress/kendo-react-dropdowns';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { ChangeRequestStatus } from '../../../../state/ducks/changeRequest/types';

import {
  DocumentCategory,
  DocumentRevisionStatus,
  DocumentRevisionStatusDisplay,
  EquipmentStatus,
  POStatusLabelMapping,
} from '../../../../state/ducks/documentRevisions/types';

import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';

interface Props extends GridFilterCellProps {
  defaultItem: string
  data: DocumentRevisionStatus[] | ChangeRequestStatus[] | POStatusLabelMapping[] | EquipmentStatus[] | string[]
  documentTypeCategory?: string
}

export const StatusMultiFilterTemplate = ({ data, onChange, value, field, documentTypeCategory }: Props) => {
  const intl = useIntl();
  const selectedValue = Array.isArray(value) ? value : [];
  const hasValue = (values: string[]) => values.length > 0;

  const getDisplayValue = (item: string) =>
    documentTypeCategory === DocumentCategory.PurchaseOrder && item === DocumentRevisionStatusDisplay.Released
      ? DocumentRevisionStatusDisplay.Approved
      : item;

  const onMultiSelectChange = ({ target, syntheticEvent }: MultiSelectChangeEvent) => {
    const updatedValues = target.value || [];

    setSelectedValues(updatedValues);

    onChange({
      value: updatedValues,
      operator: 'eq',
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

  const [selectedValues, setSelectedValues] = React.useState<string[]>(Array.isArray(value) ? value : []);

  React.useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : value ? [value] : []);
  }, [value]);
  console.log('StatusMultiFilterTemplate rendered with value: ', value, ' and selectedValues: ', selectedValues);

  return (
    <div
      className="status-multi-filter k-filtercell"
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <MultiSelect
          data={data}
          onChange={onMultiSelectChange}
          value={selectedValues}
          placeholder="Select status"
          autoClose={false}
          itemRender={(li, itemProps) =>
            React.cloneElement(li, li.props, <span>{getDisplayValue(itemProps?.dataItem as string)}</span>)
          }
          tagRender={(tagData, li) => {
            const children = React.Children.toArray(li.props.children);

            return React.cloneElement(
              li,
              li.props,
              <>
                <span className="multi-select-status">{getDisplayValue(tagData.text)}</span>
                {children[1]}
              </>,
            );
          }}
        />

      </div>

      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({
          id: TranslatedText[DisplayText.CLEAR],
        })}
        disabled={!hasValue(selectedValue)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
