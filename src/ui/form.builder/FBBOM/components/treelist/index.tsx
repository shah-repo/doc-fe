import { Grid } from '@material-ui/core';
import { GridToolbar } from '@progress/kendo-react-grid';
import { extendDataItem, filterBy, mapTree, orderBy, TreeList, TreeListCellProps, TreeListColumnReorderEvent, TreeListDataStateChangeEvent } from '@progress/kendo-react-treelist';
import cx from 'classnames';
import { useFormik } from 'formik';
import { isEmpty, map, omit, replace } from 'lodash';
import { useObserver } from 'mobx-react';
import PopperJs from 'popper.js';
import * as React from 'react';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import { withThemeNext } from '../../../../layout/theme-next';
import { MODE_FIELD } from '../../constants';
import { BOM, BOMEditEvent, EditableBOM } from '../../interface';
import { ActionsCell } from './column.templates/Actions';
import { CustomColumnMenu } from './column.templates/CustomColumnMenu';
import ColumnShowHideTreeMenu from './common/ColumnShowHideTreeMenu';
import { CustomTreeListColumnProps, EXPAND_FIELD, SUB_ITEMS_FIELD, TreeColumns, TREELIST_CONFIG } from './constants';
import bom from './data';
import { BOMState, CustomTreeListExpandChangeEvent, CustomTreeListRowProps, FBBOMProps } from './interface';
import useStyles from './styles';

const FBBOMTreeList: React.FC<FBBOMProps> = () => {
  const classes = useStyles();
  const [state, setState] = React.useState<BOMState>({
    data: [...bom],
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [1, 3],
    inEdit: [],
  });
  const actionsRef = React.useRef<PopperJs>(null);
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
    const { expanded, inEdit } = state;
    return mapTree(dataTree, SUB_ITEMS_FIELD, (item) =>
      extendDataItem(item, SUB_ITEMS_FIELD, {
        [EXPAND_FIELD]: expanded.includes(item.id),
        [MODE_FIELD]: Boolean(inEdit.find((i) => i.id === item.id)),
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

  const formik = useFormik<Partial<EditableBOM>>({
    initialValues: {},
    // validate: (values) => {
    //   const errors: Record<string, string> = {};
    //   return errors;
    // },
    onSubmit: (values) => {
      const updatedBOM = omit(values, [MODE_FIELD]);
      // Save API
      // updateLotTransfer?.(lotTransferToSave as BOM);
      console.log('updatedBOM :', updatedBOM);
      discardBOM();
    },
  });
  // const createBOM = () => setEditedBOM({
  //   id: uuidv4(),
  //   date: new Date().toISOString(),
  //   [MODE_FIELD]: Mode.add,
  // });

  const editBOM = ({ dataItem }: BOMEditEvent) => {
    setState({
      ...state,
      inEdit: [extendDataItem(dataItem, SUB_ITEMS_FIELD)],
    });
    setTimeout(() => {
    actionsRef?.current?.scheduleUpdate();
    }, 100);
  };

  const discardBOM = () => {
    setState({
      ...state,
      inEdit: [],
    });
    formik?.resetForm();
  };

  const removeBOM = () => {
    // Delete API Here
    discardBOM();
  };

  const onRestore = () => {
    // TODO
  };

  const onReorder = () => {
    // TODO
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableBOM;
    // const color = isEmpty(props.dataItem.employees) ? Colors.white : Colors.gray;
    if (isEmpty(props.dataItem.refDesignator)) {
      props.dataItem.refDesignator = '-';
    }
    // classes.updatingRow
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''),
        {
          [classes.WhiteBg]: isEmpty(props.dataItem.employees),
          [classes.grayBg]: !isEmpty(props.dataItem.employees),
        }),
    };
    if (!item[MODE_FIELD]) {
      return React.cloneElement(row, modifiedProps);
    }

    const actions = (
      <td className={classes.actionsCell}>
        <ActionsCell
          dataItem={item}
          onConfirm={formik?.submitForm}
          onDiscard={discardBOM}
          onDelete={removeBOM}
          onRestore={onRestore}
          onReorder={onReorder}
          // isDeleteDisabled={false} // override later
          rootClassName={classes.popperHolder}
          popperRef={actionsRef}
        />
      </td>
    );

    return React.cloneElement(row,
      {
        ...modifiedProps,
        className: cx(row.props.className, classes.updatingRow),
      },
      [row.props.children, actions],
    );
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

  const onLock = React.useCallback(({ field, locked, closeMenu }: CustomTreeListColumnProps & {closeMenu: () => void}) => {
    const index = columns.findIndex(c => c.field === field);
    const column = columns[index];
    if (column) {
      const newColumns = [...columns];
      newColumns.splice(index, 1, { ...column, locked: !locked });
      setColumns(newColumns);
      closeMenu?.();
    }
  }, [columns]);

  const handleResize = () => {
    actionsRef.current?.scheduleUpdate();
  };

  const { _tabsState } = SM.useStores();
  const size = useObserver(() => _tabsState?.contentSize);

  return (<Grid container>
    <Grid item xs={12}>
      <TreeList
        {...state.dataState}
        style={{ width: '100%', maxHeight: size ? size?.height - 160 : 'auto', overflow: 'scroll' }}
        tableProps={{ style: { width: '2023px' } }}
        editField={MODE_FIELD}
        expandField={EXPAND_FIELD}
        subItemsField={SUB_ITEMS_FIELD}
        onExpandChange={onExpandChange}
        rowRender={rowRender}
        data={processData()}
        onDataStateChange={handleDataStateChange}
        columns={getColumns()}
        columnMenu={(props) => (
          <CustomColumnMenu
            {...props}
            columns={getColumns()}
            {...{
              onLock,
              onColumnShowHide,
            }}
          />
        )}
        onRowClick={editBOM}
        onColumnReorder={onColumnReorder}
        resizable={TREELIST_CONFIG.resizable}
        reorderable={TREELIST_CONFIG.reorderable}
        sortable={TREELIST_CONFIG.sortable}
        toolbar={renderToolbar}
        cellRender={cellRender}
        onColumnResize={handleResize}
      />
    </Grid>
  </Grid>);
};

export default withThemeNext(React.forwardRef(FBBOMTreeList));
