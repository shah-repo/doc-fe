import { FilterDescriptor } from '@progress/kendo-data-query';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { TreeListFilterCellProps } from '@progress/kendo-react-treelist/dist/npm/interfaces/TreeListFilterCellProps';
import { unionBy } from 'lodash';
import * as React from 'react';
import { translate } from '../../../../../../common/intl';
import DropdownFilter from '../../../../FBApprovalMatrix/components/DropdownFilter';
import { createOption } from '../../../../FBApprovalMatrix/components/Grid/constants';

const YesNoOptionsFilter: React.ComponentType<TreeListFilterCellProps> = (props) => {
  const { field = '', filter = [], onFilterChange } = props;
  const onChange: GridFilterCellProps['onChange'] = (event) => {
    const { operator, value, syntheticEvent } = event;

    const activeFilter = {
      operator,
      field,
      value,
    };

    const nextFilter = unionBy(filter, [activeFilter], 'field').reduce((filters, currentFilter) => {
      if (currentFilter.field === field && value !== undefined) {
        return [...filters, activeFilter];
      }
      return filters;
    }, [] as FilterDescriptor[]);

    onFilterChange?.({
      filter: nextFilter,
      field,
      syntheticEvent,
    });
  };

  const currentFilter = filter?.find(f => f.field === field);
  const value = currentFilter?.value;

  return (
    <DropdownFilter
      {...props}
      onChange={onChange}
      operators={[]}
      booleanValues={[]}
      filterType="boolean"
      value={value}
      data={[
        createOption(true, translate('common.true')),
        createOption(false, translate('common.false')),
      ]}
      defaultItem={createOption(undefined, translate('common.all'))} />
  );
};

export default YesNoOptionsFilter;
