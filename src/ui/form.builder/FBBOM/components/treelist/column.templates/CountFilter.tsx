import { FilterDescriptor } from '@progress/kendo-data-query';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { TreeListFilterCellProps } from '@progress/kendo-react-treelist/dist/npm/interfaces/TreeListFilterCellProps';
import { unionBy } from 'lodash';
import * as React from 'react';
import { translate } from '../../../../../../common/intl';
import DropdownFilter from '../../../../FBApprovalMatrix/components/DropdownFilter';
import { createOption } from '../../../../FBApprovalMatrix/components/Grid/constants';
import { styles } from './styles';

const getShapedValue = ({ operator }: FilterDescriptor) => {
  switch (operator) {
    case 'eq':
      return false;
    case 'gt':
      return true;
    default:
      return undefined;
  }
};

const getShapedFilter = (field: string, { value }: FilterDescriptor) => {
  switch (value) {
    case true:
      return {
        field,
        operator: 'gt',
        value: 0,
      };
    case false:
      return {
        field,
        operator: 'eq',
        value: 0,
      };
    default:
      return {
        field,
        operator: 'eq',
        value: undefined,
      };
  }
};

const CountFilter: React.ComponentType<TreeListFilterCellProps> = (props) => {
  const classes = styles();
  const { field = '', filter = [], onFilterChange } = props;
  const onChange: GridFilterCellProps['onChange'] = (event) => {
    const { value, syntheticEvent } = event;

    const activeFilter = getShapedFilter(field, event);

    const nextFilters = unionBy(filter, [activeFilter], 'field').reduce<FilterDescriptor[]>((filters, currentFilter) => {
      if (currentFilter.field === field) {
        return value !== undefined ? [...filters, activeFilter] : filters;
      }
      return [...filters, currentFilter];
    }, []);

    onFilterChange?.({
      filter: nextFilters,
      field,
      syntheticEvent,
    });
  };

  const currentFilter = filter?.find(f => f.field === field);
  const value = currentFilter ? getShapedValue(currentFilter) : undefined;

  return (<div className={classes.filterCell}>
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
  </div>);
};

export default CountFilter;
