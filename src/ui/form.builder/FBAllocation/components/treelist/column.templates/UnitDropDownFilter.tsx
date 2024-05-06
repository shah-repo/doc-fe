import { DropDownList } from '@progress/kendo-react-dropdowns';
import { FilterDescriptor } from '@progress/kendo-react-dropdowns/dist/npm/common/filterDescriptor';
import { TreeListFilterCellProps } from '@progress/kendo-react-treelist/dist/npm/interfaces/TreeListFilterCellProps';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { FBOption } from '../../../..';
import { translate } from '../../../../../../common/intl';
import { KendoGridFilterCellOperators } from '../../../../../components/KendoGrid/interfaces';
import unitsOptions from '../../../../FBData/unitsOptions.json';

const UnitDropDownFilter: React.ComponentType<TreeListFilterCellProps> = (props) => {
  const { field, onFilterChange } = props;
  const data = unitsOptions.map(item => ({ ...item, text: translate(item.text) }));
  const [value, setValue] = React.useState<FBOption>({} as FBOption);

  const onChange = React.useCallback(
    (event) => {
      const value = event?.target?.value;
      setValue(value);
      updateFilter(value, event);
    },
    [props?.filter, field, onFilterChange],
  );

  const onClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setValue({} as FBOption);
    updateFilter({}, event);
  };

  const updateFilter = (value, event) => {
    const filter = [...props.filter as FilterDescriptor[]];
    const currentFilterIndex = filter.findIndex((f) => f.field === field);

    if (currentFilterIndex !== -1) {
      filter.splice(currentFilterIndex, 1);
    }

    if (!isEmpty(value)) {
      filter.push({
        value: value.text,
        field,
        operator: KendoGridFilterCellOperators.CONTAINS,
      });
    }

    onFilterChange?.({
      filter,
      field: field as string,
      syntheticEvent: event?.syntheticEvent,
    });
  };

  return (
    <div className="k-filtercell">
      <DropDownList data={data} textField="text" dataItemKey="value" value={value} onChange={onChange} />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={translate('common.clear')}
        disabled={isEmpty(value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
export default UnitDropDownFilter;
