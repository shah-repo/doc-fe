import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Divider, Grid } from '@material-ui/core';
import { GridToolbar } from '@progress/kendo-react-grid';
import { extendDataItem, filterBy, mapTree, orderBy, TreeList, TreeListCellProps, TreeListColumnReorderEvent, TreeListDataStateChangeEvent, TreeListDraggableRow, TreeListRowDragEvent } from '@progress/kendo-react-treelist';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { isEmpty, map, omit, replace, tail, take } from 'lodash';
import { useObserver } from 'mobx-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import { Button as AddButton } from '../../../../components/forms/fields-next';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { withThemeNext } from '../../../../layout/theme-next';
import { FB } from '../../../helpers';
import { ADD_FIELD, MODE_FIELD } from '../../constants';
import { BOM, BOMEditEvent, EditableBOM } from '../../interface';
import { ActionsCell } from './column.templates/Actions';
import { CustomColumnMenu } from './column.templates/CustomColumnMenu';
import ColumnShowHideTreeMenu from './common/ColumnShowHideTreeMenu';
import { CustomTreeListColumnProps, EXPAND_FIELD, SUB_ITEMS_FIELD, TreeColumns, TREELIST_CONFIG } from './constants';
import DummyBOM from './data';
import { BOMState, CustomTreeListExpandChangeEvent, CustomTreeListRowProps, FBBOMProps } from './interface';
import useStyles from './styles';
import { isOfSameParent } from './utils';

const FBBOMTreeList: React.FC<FBBOMProps> = () => {
  const classes = useStyles();
  const { workspaceState } = FB.useStores();
  const {
    id,
  } = workspaceState || {};
  const [state, setState] = React.useState<BOMState>({
    data: [],
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [],
    inEdit: [],
  });

  const fetchBOMTreeListAsync = useAsync({
    onSuccess: (data: BOM[] = []) => {
      console.log('Data :', data);
      setState({
        ...state,
        data: [...DummyBOM],
        expanded: [DummyBOM[0].id],
      });
    },
    onError: (response) => {
      console.log('response :', response);
      setState({
        ...state,
        data: [...DummyBOM],
        expanded: [DummyBOM[0].id],
      });
    },
  });

  useEffect(() => {
    fetchBOMTreeListAsync.start(
      fetchBOMTreeList,
      id,
      fetchBOMTreeListAsync,
    );
  }, []);

  const fetchBOMTreeList = useActionCreator(documentRevisionsActions.fetchDocumentByRevId);

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

  const confirmationDialog = useDialog();
  const [selectedPart, setSelectedPart] = useState();
  const confirmDeletePart = (e: React.MouseEvent<HTMLElement>) => {
    // API call here
    discardBOM(selectedPart);
    confirmationDialog.close();
  };

  const cancelDeletePart = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    confirmationDialog.close();
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

  const createNewItem = () => {
    return {
      id: uuidv4(),
      displayRevision: '',
      status: '',
      title: '',
      docId: '',
      cost: '',
      leadTime: '',
      hasPrimaryAttachment: '',
      hasAttachments: false,
      issues: false,
      vendor: false,
      comments: '',
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
    };
  };

  const isNewBOMAdditionInProgress = () => {
    return state.data[0].employees && state.data[0].employees.filter(data => data[ADD_FIELD])?.length > 0;
  };
  const addBOM = () => {
    if (isNewBOMAdditionInProgress()) {
      return;
    }
    const newBOM: EditableBOM = createNewItem();
    state.data[0].employees = state.data[0].employees?.filter(data => !data[ADD_FIELD]);
    state.data[0].employees?.push(newBOM);
    setState({
      ...state,
      data: [...state.data],
      expanded: [state.data[0].id],
      inEdit: [newBOM],
    });
  };

  const editBOM = ({ dataItem, level }: BOMEditEvent) => {
    if (level?.length !== 2) {
      return;
    }
    if (isNewBOMAdditionInProgress() && !dataItem[ADD_FIELD]) {
      state.data[0].employees = state.data[0].employees?.filter(data => !data[ADD_FIELD]);
    }
    setState({
      ...state,
      data: [...state.data],
      inEdit: [extendDataItem(dataItem, SUB_ITEMS_FIELD)],
    });
  };

  const discardBOM = (dataItem?) => {
    if (dataItem && dataItem[ADD_FIELD]) {
      state.data[0].employees = state.data[0].employees?.filter(data => !data[ADD_FIELD]);
    }
    setState({
      ...state,
      inEdit: [],
    });
    formik?.resetForm();
  };

  const removeBOM = (dataItem) => {
    // Delete API Here
    confirmationDialog.open();
    setSelectedPart(dataItem);
  };

  const onRestore = () => {
    // TODO
  };

  const onReorder = () => {
    // TODO
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableBOM;
    if (isEmpty(props.dataItem.refDesignator)) {
      props.dataItem.refDesignator = '-';
    }
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
          rootClassName={classes.popperHolder}
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
    const ids: string[] = [];
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
    const { data } = state;
    setState({
      ...state,
      expanded: [data[0]?.id],
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

  const { _tabsState } = SM.useStores();
  const size = useObserver(() => _tabsState?.contentSize);

  const onRowDrop = (event: TreeListRowDragEvent) => {
    if (event?.draggedOver && isOfSameParent(event?.dragged, event?.draggedOver)) {
      const parentIndices: number[] = event.dragged.slice(0, -1);
      const draggedChildIndex: number = event.dragged.slice(-1)[0];
      const draggedOverChildIndex: number = event.draggedOver?.slice(-1)[0];
      const swapChildElements = (tree: BOM[], parentIndices: number[]) => {
        if (!isEmpty(parentIndices)) {
          const index = take(parentIndices)[0];
          tree[index][SUB_ITEMS_FIELD] = swapChildElements(tree[index][SUB_ITEMS_FIELD] as BOM[], tail(parentIndices));
        } else {
          const draggedChild = tree[draggedChildIndex];
          const draggedOver = tree[draggedOverChildIndex];
          tree.splice(draggedOverChildIndex, 1, draggedChild);
          tree.splice(draggedChildIndex, 1, draggedOver);
        }
        return tree;
      };
      const updatedBOMTree = swapChildElements(state.data, parentIndices);
      setState({
        ...state,
        data: [...updatedBOMTree],
      });
    }
  };

  return (<>
    <Grid container alignItems="center" justify="space-between" style={{ padding: 0 }}>
      <Grid item className={classes.header}>
        {translate('tabId.bom')}
      </Grid>
      <Grid item>
        <Button
          disableRipple
          variant="text"
          className={classes.addItem}
          startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
          onClick={addBOM}
        >
          {translate('bom.header.add.item')}
        </Button>
      </Grid>
    </Grid>
    <Divider />
    <Grid item className={classes.tableContainer}>
      <FormikProvider value={formik}>
        <Grid container>
          <Grid item xs={12}>
            <TreeList
              {...state.dataState}
              style={{ width: '100%', maxHeight: size ? size?.height - 160 : 'auto', overflow: 'auto' }}
              tableProps={{ style: { width: '2423px' } }}
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
              onRowDrop={onRowDrop}
              row={TreeListDraggableRow}
            />
          </Grid>
          {confirmationDialog.isOpen && (
            <AlertDialog
              dialog={confirmationDialog}
              confirmAction={confirmDeletePart}
              cancelAction={cancelDeletePart}
              message="bom.item.delete.alert"
            />
          )}
        </Grid>
      </FormikProvider>
    </Grid>
    <Grid item>
      <AddButton
        fullWidth
        attached
        kind="add"
        className={classes.bottomAddButtom}
        data-cy="fb-control-btn"
        onClick={addBOM}
      >
        {translate('form.builder.add.item')}
      </AddButton>
    </Grid>
  </>
  );
};

export default withThemeNext(React.forwardRef(FBBOMTreeList));
