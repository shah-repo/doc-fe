import { MultiSelectChangeEvent } from '@progress/kendo-react-dropdowns';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import * as React from 'react';
import { ChangeRequestStatus } from '../../../../state/ducks/changeRequest/types';
import {
  DocumentCategory,
  DocumentRevisionStatus,
  DocumentRevisionStatusDisplay,
  EquipmentStatus,
  POStatusLabelMapping,
} from '../../../../state/ducks/documentRevisions/types';
import FilterWrapper from '../../../components/common/kendo/FilterWrapper';
import CommonMultiSelect from '../../../components/common/kendo/MultiSelectFilter';

interface Props extends GridFilterCellProps {
  data: DocumentRevisionStatus[] | ChangeRequestStatus[] | POStatusLabelMapping[] | EquipmentStatus[] | string[]
  documentTypeCategory?: string
}

export const StatusMultiSelectFilter = ({ data, onChange, value, field, documentTypeCategory }: Props) => {
  const hasValue = (values: string[]) => values.length > 0;
  const [selectedValues, setSelectedValues] = React.useState<string[]>(Array.isArray(value) ? value : []);

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

  React.useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : value ? [value] : []);
  }, [value]);

  return (
    <FilterWrapper hasValue={hasValue(selectedValues)} onClear={onClearButtonClick}>
      <CommonMultiSelect
        data={data}
        onChange={onMultiSelectChange}
        value={selectedValues}
        itemRender={(li, itemProps) =>
          React.cloneElement(li, li.props, <span>{getDisplayValue(itemProps?.dataItem as string)}</span>)
        }
        tagRender={(tagData, li) => {
          const children = React.Children.toArray(li.props.children);

          return React.cloneElement(
            li,
            li.props,
            <>
              <span>{getDisplayValue(tagData.text)}</span>
              {children[1]}
            </>,
          );
        }}
      />
    </FilterWrapper>
  );
};
