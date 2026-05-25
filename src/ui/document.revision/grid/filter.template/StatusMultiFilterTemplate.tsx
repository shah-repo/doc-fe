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

  console.log('StatusMultiFilterTemplate rendered with value: ', value);

  const onClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    onChange({
      value: '',
      operator: '',
      syntheticEvent: event,
    });
  };

  const [opened, setOpened] = React.useState(false);

  const handleOpen = () => {
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
  };

  const [selectedValues, setSelectedValues] = React.useState<string[]>(Array.isArray(value) ? value : []);

  React.useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : []);
  }, [value]);
  console.log('StatusMultiFilterTemplate rendered with value: ', value, ' and selectedValues: ', selectedValues);

  return (
    <div className="k-filtercell">
      <MultiSelect
        data={data}
        value={selectedValues}
        onChange={onMultiSelectChange}
        placeholder="Select status"
        autoClose={false}
        opened={opened}
        onOpen={handleOpen}
        onClose={handleClose}
        itemRender={(li, itemProps) => {
          const itemChildren = <span>{getDisplayValue(itemProps?.dataItem as string)}</span>;

          return React.cloneElement(li, li.props, itemChildren);
        }}
        tagRender={(tagData, li) => {
          const itemChildren = <span>{getDisplayValue(tagData.text)}</span>;
          console.log('Rendering tag for value: ', tagData.text);
          return React.cloneElement(li, li.props, itemChildren);
        }}
      />

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
