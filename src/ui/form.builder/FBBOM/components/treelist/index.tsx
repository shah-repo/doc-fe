import { Grid } from '@material-ui/core';
import { GridToolbar } from '@progress/kendo-react-grid';
import {
  extendDataItem, filterBy,
  mapTree, orderBy, TreeList, TreeListDataStateChangeEvent, TreeListExpandChangeEvent,
} from '@progress/kendo-react-treelist';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { ReactComponent as ViewGridIcon } from '../../../../../assets/images/grid_view.svg';
import { Colors, withThemeNext } from '../../../../layout/theme-next';
import { columns, expandField, subItemsField } from './constants';
import employees from './data';
import { DataState, Employee, FBBOMProps } from './interface';
import useStyles from './styles';

interface AppState {
  data: Employee[]
  dataState: DataState
  expanded: number[]
}

const FBBOMTreeList: React.FunctionComponent<FBBOMProps> = () => {
  useStyles();
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

  // const clearFilter = () => {
  //   const { dataState } = state;
  //   set(dataState, 'filter.filters', []);
  // };

  // const onColumnShowHide = ({ field }) => {
  //   each(columns, (column) => {
  //     if (column.field === field) {
  //       column.show = !column.show;
  //     }
  //   });
  // };

  // Add customozed cells to all columns
  // change css styles

  const rowRender = (row, props) => {
    const color = isEmpty(props.dataItem.employees) ? Colors.white : Colors.gray;
    return <tr {...row.props} style={{ ...row.props.style, backgroundColor: color, borderBottom: '1px solid red' }} />;
  };

  return <>
    <GridToolbar>
      <Grid container data-cy="toolbar-treelist">
        <Grid item={true} xs={6} style={{ textAlign: 'left' }}>
          {/* <ClearFilters {...{ clearFilter }} /> */}
        </Grid>
        <Grid item={true} xs={6} style={{ textAlign: 'right' }}>
          {/* <StyleTooltip
            title={<Text translation="common.column" />}
            placement="top"
            arrow
          >
            <IconButton onClick={handleClick} data-cy="manageColumnsBtn"> */}
          <ViewGridIcon />
          {/* </IconButton>
          </StyleTooltip> */}
        </Grid>
      </Grid>
    </GridToolbar>
    <TreeList
      expandField={expandField}
      subItemsField={subItemsField}
      onExpandChange={onExpandChange}
      rowRender={rowRender}
      sortable={{ mode: 'multiple' }}
      {...state.dataState}
      data={processData()}
      onDataStateChange={handleDataStateChange}
      columns={columns}
    /></>;
};

export default withThemeNext(React.forwardRef(FBBOMTreeList));
