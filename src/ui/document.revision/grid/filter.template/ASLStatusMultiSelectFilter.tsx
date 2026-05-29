import { MultiSelectChangeEvent } from '@progress/kendo-react-dropdowns';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React, { MouseEvent, useContext, useMemo } from 'react';

import { ASLStatus } from '../../../administration/general.settings/panels/SupplierSettings/ASLStatus/types';
import FilterWrapper from '../../../components/common/kendo/FilterWrapper';
import CommonMultiSelect from '../../../components/common/kendo/MultiSelectFilter';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { DocTypeTableContext } from '../../../documentType/grid/interfaces';
import useStyles from './styles';

interface CustomOptionType {
  label: string
  value: string
  aslStatusId: string
  isActive: boolean
}

export const ASLStatusMultiSelectFilter = ({ onChange, value }: GridFilterCellProps) => {
  const classes = useStyles();
  const docTypeTableContext = useContext(DocTypeTableContext);

  const aslOptions = useMemo(
    () =>
      (docTypeTableContext?.aslStatuses || []).map(
        (data: ASLStatus): CustomOptionType => ({
          value: data.internalType,
          label: data.displayLabel,
          aslStatusId: data.id,
          isActive: data.isActive,
        }),
      ),
    [docTypeTableContext?.aslStatuses],
  );

  const [selectedValues, setSelectedValues] = React.useState<string[]>(Array.isArray(value) ? value : []);

  React.useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : value ? [value] : []);
  }, [value]);

  const onMultiSelectChange = ({ target, syntheticEvent }: MultiSelectChangeEvent) => {
    const selectedIds = (target.value || []).map((item: CustomOptionType) => item.aslStatusId);

    setSelectedValues(selectedIds);

    onChange({
      value: selectedIds,
      operator: selectedIds.length ? 'eq' : '',
      syntheticEvent,
    });
  };

  const onClearButtonClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    setSelectedValues([]);

    onChange({
      value: '',
      operator: '',
      syntheticEvent: event,
    });
  };

  const selectedOptions = aslOptions.filter((option) => selectedValues.includes(option.aslStatusId));

  return (
    <FilterWrapper hasValue={selectedValues.length > 0} onClear={onClearButtonClick}>
      <CommonMultiSelect
        data={aslOptions}
        value={selectedOptions}
        onChange={onMultiSelectChange}
        dataItemKey="aslStatusId"
        textField="label"
        itemRender={(li, itemProps) =>
          React.cloneElement(
            li,
            li.props,
            <OverflowTooltip
              arrow
              placement="top"
              title={itemProps.dataItem.label}
              wrapperClassName={classes.dropdownOption}
            >
              {itemProps.dataItem.label}
            </OverflowTooltip>,
          )
        }
        tagRender={(tagData, li) => {
          const children = React.Children.toArray(li.props.children);

          return React.cloneElement(
            li,
            li.props,
            <>
              <OverflowTooltip arrow placement="top" title={tagData.text} wrapperClassName={classes.multiSelectStatus}>
                {tagData.text}
              </OverflowTooltip>
              {children[1]}
            </>,
          );
        }}
      />
    </FilterWrapper>
  );
};
