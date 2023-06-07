import {
  extendDataItem, filterBy,
  mapTree, orderBy, TreeListDataStateChangeEvent, TreeListExpandChangeEvent,
} from '@progress/kendo-react-treelist';
import * as React from 'react';
import { expandField, subItemsField } from './constants';
import employees from './data';
import { DataState, Employee } from './interface';

interface AppState {
  data: Employee[]
  dataState: DataState
  expanded: number[]
}

const App = () => {
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

  const addExpandField = (dataTree: Employee) => {
    const expanded: number[] = state.expanded;
    return mapTree(dataTree, subItemsField, (item) =>
      extendDataItem(item, subItemsField, {
        [expandField]: expanded.includes(item.id),
      }),
    );
  };

  const processData = () => {
    const { data, dataState } = state;
    const filteredData: Employee[] = filterBy(
      data,
      dataState.filter,
      subItemsField,
    );
    const sortedData: Employee[] = orderBy(
      filteredData,
      dataState.sort,
      subItemsField,
    );
    return addExpandField(sortedData);
  };

  return (
    <h1>i am</h1>
    // <TreeList
    //   style={{ maxHeight: '510px', overflow: 'auto' }}
    //   expandField={expandField}
    //   subItemsField={subItemsField}
    //   onExpandChange={onExpandChange}
    //   sortable={{ mode: 'multiple' }}
    //   {...state.dataState}
    //   data={processData()}
    //   onDataStateChange={handleDataStateChange}
    //   columns={columns}
    // />
  );
};
