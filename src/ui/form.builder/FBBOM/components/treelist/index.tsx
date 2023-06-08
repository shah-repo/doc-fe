import {
  extendDataItem, filterBy,
  mapTree, orderBy, TreeList, TreeListDataStateChangeEvent, TreeListExpandChangeEvent,
} from '@progress/kendo-react-treelist';
import * as React from 'react';
import { columns, expandField, subItemsField } from './constants';
import employees from './data';
import { DataState, Employee, FBBOMProps } from './interface';

interface AppState {
  data: Employee[]
  dataState: DataState
  expanded: number[]
}

const FBBOMTreeList: React.FunctionComponent<FBBOMProps> = () => {
  const [state, setState] = React.useState<AppState>({
    data: [...employees],
    dataState: {
      sort: [{ field: 'name', dir: 'asc' }],
      filter: [],
    },
    expanded: [1, 2, 32],
  });

  const onExpandChange = (e: TreeListExpandChangeEvent) => {
    setState({
      ...state,
      expanded: e.value
        ? state.expanded.filter((id) => id !== e.dataItem.id)
        : [...state.expanded, e.dataItem.id],
    });
  };

  const handleDataStateChange = (event: TreeListDataStateChangeEvent) => {
    setState({
      ...state,
      dataState: event.dataState,
    });
  };

  const addExpandField = (dataTree: Employee[]) => {
    const expanded: number[] = state.expanded;
    return mapTree(dataTree, subItemsField, (item) =>
      extendDataItem(item, subItemsField, {
        [expandField]: expanded.includes(item.id),
      }),
    );
  };

  const processData = () => {
    const { data, dataState } = state;
    const filteredData = dataState.filter && filterBy(
      data,
      dataState.filter,
      subItemsField,
    );
    const sortedData = dataState.sort && filteredData && orderBy(
      filteredData,
      dataState.sort,
      subItemsField,
    );
    return addExpandField(sortedData as Employee[]);
  };

  return <TreeList
    expandField={expandField}
    subItemsField={subItemsField}
    onExpandChange={onExpandChange}
    sortable={{ mode: 'multiple' }}
    {...state.dataState}
    data={processData()}
    onDataStateChange={handleDataStateChange}
    columns={columns}
  />;
};

export default FBBOMTreeList;
