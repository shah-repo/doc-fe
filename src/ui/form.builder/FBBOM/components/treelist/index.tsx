import { Grid } from '@material-ui/core';
import { GridToolbar } from '@progress/kendo-react-grid';
import { extendDataItem, filterBy, mapTree, orderBy, TreeList, TreeListCellProps, TreeListColumnReorderEvent, TreeListDataStateChangeEvent } from '@progress/kendo-react-treelist';
import cx from 'classnames';
import { isEmpty, map } from 'lodash';
import * as React from 'react';
import { translate } from '../../../../../common/intl';
import { Colors, withThemeNext } from '../../../../layout/theme-next';
import ColumnShowHideTreeMenu from './common/ColumnShowHideTreeMenu';
import { CustomTreeListColumnProps, EXPAND_FIELD, SUB_ITEMS_FIELD, TreeColumns, TREELIST_CONFIG } from './constants';
import bom from './data';
import { BOM, BOMState, CustomTreeListExpandChangeEvent, CustomTreeListRowProps, FBBOMProps } from './interface';
import useStyles from './styles';

const FBBOMTreeList: React.FunctionComponent<FBBOMProps> = () => {
  const classes = useStyles();
  const [state, setState] = React.useState<BOMState>({
    data: [...bom],
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [1, 3],
  });
  const [columns, setColumns] = React.useState<CustomTreeListColumnProps[]>(TreeColumns);

  const onExpandChange = (event: CustomTreeListExpandChangeEvent) => {
    const expanded = event.value
      ? state.expanded.filter((id) => id !== event.dataItem.id)
      : [...state.expanded, event.dataItem.id];
    setState({
      ...state,
      expanded,
    });
  };

  const handleDataStateChange = (event: TreeListDataStateChangeEvent) => {
    setState({
      ...state,
      dataState: event.dataState,
    });
  };

  const addExpandField = (dataTree: BOM[]) => {
    const expanded: number[] = state.expanded;
    return mapTree(dataTree, SUB_ITEMS_FIELD, (item) =>
      extendDataItem(item, SUB_ITEMS_FIELD, {
        [EXPAND_FIELD]: expanded.includes(item.id),
      }),
    );
  };

  const processData = () => {
    const { data, dataState } = state;
    const filteredData = dataState.filter && filterBy(
      data,
      dataState.filter,
      SUB_ITEMS_FIELD,
    );
    const sortedData = dataState.sort && filteredData && orderBy(
      filteredData,
      dataState.sort,
      SUB_ITEMS_FIELD,
    );
    return addExpandField(sortedData as BOM[]);
  };

  const onColumnShowHide = ({ field }: CustomTreeListColumnProps) => {
    const dataColumns = map(columns, (column: CustomTreeListColumnProps) => {
      if (column.field === field) {
        column.hidden = !column.hidden;
      }
      return column;
    });
    setColumns(dataColumns);
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const color = isEmpty(props.dataItem.employees) ? Colors.white : Colors.gray;
    if (isEmpty(props.dataItem.refDesignator)) {
      props.dataItem.refDesignator = '-';
    }
    return React.cloneElement(row, {
      style: {
        backgroundColor: color,
      },
    });
  };

  const getAllItemIds = (items: BOM[]) => {
    if (!items) return [];
    const ids: number[] = [];
    items.forEach((item) => {
      ids.push(item.id);
      if (item.employees) {
        ids.push(...getAllItemIds(item.employees));
      }
    });
    return ids;
  };

  const handleExpandAll = () => {
    const { data } = state;
    const expanded = getAllItemIds(data);
    setState({
      ...state,
      expanded,
    });
  };

  const handleCollapseAll = () => {
    setState({
      ...state,
      expanded: [],
    });
  };

  const renderToolbar = <GridToolbar>
    <Grid container justify="space-between">
      <Grid item data-cy="collapse-expand-collapse" className={classes.toggleExpandCollapse}>
        <span onClick={handleExpandAll}>{translate('common.expand.all')} / </span>
        <span onClick={handleCollapseAll}>{translate('common.collapse.all')}</span>
      </Grid>
      <Grid item data-cy="show-hide-columns">
        <ColumnShowHideTreeMenu
          columnDefinition={columns}
          onChange={onColumnShowHide}
        />
      </Grid>
    </Grid>
  </GridToolbar>;

  const cellRender = (tdElement: React.ReactElement<HTMLTableCellElement, string | React.JSXElementConstructor<any>> | null, cellProps: TreeListCellProps): React.ReactElement<HTMLTableCellElement> => {
    const props = { ...tdElement?.props, className: cx(tdElement?.props.className, classes.borderBottom) };
    const defaultRendering = { ...tdElement, props: props };
    return defaultRendering as React.ReactElement<HTMLTableCellElement>;
  };

  const getColumns = () => {
    return columns.filter(({ hidden }) => !hidden);
  };

  const onColumnReorder = (event: TreeListColumnReorderEvent) => {
    setColumns(event.columns as CustomTreeListColumnProps[]);
  };

  return (<Grid container>
    <Grid item xs={12}>
      <TreeList
        {...state.dataState}
        style={{ width: '100%', overflow: 'scroll' }}
        tableProps={{ style: { width: '2100px' } }}
        expandField={EXPAND_FIELD}
        subItemsField={SUB_ITEMS_FIELD}
        onExpandChange={onExpandChange}
        rowRender={rowRender}
        data={processData()}
        onDataStateChange={handleDataStateChange}
        columns={getColumns()}
        onColumnReorder={onColumnReorder}
        resizable={TREELIST_CONFIG.resizable}
        reorderable={TREELIST_CONFIG.reorderable}
        sortable={TREELIST_CONFIG.sortable}
        toolbar={renderToolbar}
        cellRender={cellRender}
      />
    </Grid>
  </Grid>);
};

export default withThemeNext(React.forwardRef(FBBOMTreeList));
