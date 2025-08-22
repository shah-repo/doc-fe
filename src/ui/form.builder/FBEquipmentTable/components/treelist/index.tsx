import {
  Grid,
} from '@material-ui/core';
import { FilterDescriptor } from '@progress/kendo-data-query';
import {
  extendDataItem,
  filterBy,
  mapTree,
  orderBy, TreeList,
  TreeListCellProps,
} from '@progress/kendo-react-treelist';
import { ScrollMode } from '@progress/kendo-react-treelist/dist/npm/ScrollMode';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import {
  cloneDeep,
  isEmpty,
  isNil,
  keyBy,
  map, replace, uniq,
} from 'lodash';
import { useObserver } from 'mobx-react';
import * as React from 'react';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import { ColumnMenuContext } from '../../../../components/common/treelist/column.templates/CustomColumnMenu';
import { CustomTreeListColumnProps } from '../../../../components/common/treelist/types';
import { Button as AddButton } from '../../../../components/forms/fields-next';
import { withThemeNext } from '../../../../layout/theme-next';
import { FBProcedureItemConfig } from '../../../FBProcedureItem/FBProcedureItem.types';
import { FB } from '../../../helpers';
import { EditableEquipmentItem, EquipmentItem, EquipmentItemEditEvent } from '../../interface';
import {
  ADD_FIELD,
  DATA_ITEM_KEY,
  EXPAND_FIELD,
  MODE_FIELD, SUB_ITEMS_FIELD,
  TREELIST_CONFIG,
} from './constants';
import {
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  EquipmentItemState,
  FBEquipmentProps,
} from './interface';
import { TreeListMPISchema } from './MPISchema';
import { TreeListSchema } from './schema';
import useStyles from './styles';
import { useOptions } from './useOptions';
import { prepareData } from './utils';

const FBEquipmentTable: React.FC<FBEquipmentProps> = ({
  items,
  type,
  getItem,
  handleRemove,
  isDisabled,
  isDesign,
  isLHRStep,
  lhrStepIndex,
  isMPIProcedure,
  isShowOnly = false,
}) => {
  console.log('isDisabled', isDisabled, isDesign, isLHRStep);
  const { _tabsState } = SM.useStores();
  const { procedureState, mpiProcedureState, workspaceState, lhrStepState } = FB.useStores();
  const { useRef } = React;
  const treeListRef = useRef(null);
  const size = useObserver(() => _tabsState?.contentSize);
  const classes = useStyles({ size });
  const { equipmentOptions } = useOptions();

  const [state, setState] = React.useState<EquipmentItemState>({
    data: prepareData(cloneDeep(items) ?? []),
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [],
    inEdit: [],
  });

  React.useEffect(() => {
    console.log('items', items);
    setState((prevState) => ({
      ...prevState,
      data: prepareData(cloneDeep(items) ?? []),
    }));
  }, [items]);

  const formik = useFormik<Partial<EditableEquipmentItem>>({
    initialValues: {},
    onSubmit: (values: Partial<EditableEquipmentItem>) => {
      console.log({ values });
      const { id = '', plannedId = '', title = '', LHRTparameter } = values;
      const newEquipItem: EditableEquipmentItem = {
        id,
        title: isDesign ? title : plannedId,
        type: values.type,
      };

      if (isLHRStep && lhrStepIndex) {
        updateLHRTEquipmentItem(values);
        return;
      }
      if (isDesign) {
        newEquipItem.LHRTparameter = LHRTparameter;
      }

      const allSteps = workspaceState?.schema?.filter((item) => item.type === 'mpiprocedure');
      procedureState?.addItem(newEquipItem as FBProcedureItemConfig, type, allSteps);
      mpiProcedureState?.addItem(newEquipItem as FBProcedureItemConfig, type, allSteps);
      discardEquipItem();
    },
  });

  const updateLHRTEquipmentItem = (item) => {
    const procedureItem = {
      id: item.id,
      title: item.title,
      paramsId: item.paramsId,
    };

    const schemaItem = workspaceState?.getSchemaItemAt(lhrStepIndex);
        lhrStepState?.editItem(procedureItem, type);
        if (!lhrStepIndex) {
          return;
        }
        if (schemaItem) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          workspaceState!.schema![lhrStepIndex] = {
            ...schemaItem,
            editorConfig: {
              ...schemaItem?.editorConfig,
              parameters: {
                ...keyBy(lhrStepState?.editedParameters, 'paramsId'),
              },
            },
          };
        }
        workspaceState?.saveDocRev();
        const updatedProcedureItem = {
          ...procedureItem,
          plannedId: procedureItem.title,
        };
        discardEquipItem(updatedProcedureItem);
  };

  const discardEquipItem = (dataItem?: EditableEquipmentItem) => {
    if (dataItem?.[ADD_FIELD]) {
      if (dataItem.isActualIdAddition) {
        const parentIndex = state.data?.findIndex((data) => {
          return data.plannedId === dataItem.parentEquipPlannedId;
        });
        if (parentIndex !== -1) {
          state.data[parentIndex][SUB_ITEMS_FIELD] = state.data[parentIndex][SUB_ITEMS_FIELD]?.filter(
            (data) => !data[ADD_FIELD],
          );
        }
      } else {
        state.data = state.data?.filter((data) => !data[ADD_FIELD]);
      }
    }

    setState(prevState => ({
      ...prevState,
      data: [...state.data],
      inEdit: [],
    }));
      formik?.resetForm();
  };

  const removeEquipItem = (dataItem: EditableEquipmentItem) => {
    handleRemove?.(dataItem.id ?? '');
  };

  const updateState = (stateInfo) => {
    setState(stateInfo);
  };

  const ignorePreviouslyAddedItems = (data: EditableEquipmentItem[]) => {
    return data?.filter((data) => {
      const isEquipmentItemAddExist = !data[ADD_FIELD];
      if (data[SUB_ITEMS_FIELD]) {
        data[SUB_ITEMS_FIELD] = data[SUB_ITEMS_FIELD]?.filter((lot) => !lot[ADD_FIELD]);
      }
      return isEquipmentItemAddExist;
    });
  };

  const createNewLotItem = () => {
    return {
      id: FB.uniqid,
      plannedId: '',
      actualId: '',
      calDueDate: '',
      pmDueDate: '',
      isActualIdAddition: true,
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
    };
  };

  const addActualId = (dataItem: EditableEquipmentItem) => {
    const index = state?.data?.findIndex((data) => {
      return data.id === dataItem.id;
    });
    state.data = ignorePreviouslyAddedItems(state.data);

    if (state.data.length && index !== -1) {
      const newActualItem: EditableEquipmentItem = createNewLotItem();
      newActualItem.parentEquipPlannedId = dataItem.plannedId;
      newActualItem.parentId = dataItem.id;
      state.data[index][SUB_ITEMS_FIELD] = state.data[index][SUB_ITEMS_FIELD]?.filter((data) => !data[ADD_FIELD]);

      if (isNil(state.data[index][SUB_ITEMS_FIELD])) {
        state.data[index][SUB_ITEMS_FIELD] = [];
      }

        state.data[index][SUB_ITEMS_FIELD]?.unshift(newActualItem);

        updateState({
          ...state,
          data: [...state.data],
          expanded: [state.data[index].id],
          inEdit: [newActualItem],
        });
    }
  };

  const schema: CustomTreeListColumnProps[] = (isMPIProcedure ? TreeListMPISchema : TreeListSchema)({
    actionsClass: classes.actionsCell,
    popperHolder: classes.popperHolder,
    parentRevId: '',
    getItem,
    addActualId: addActualId,
    equipmentOptions,
    onDiscard: discardEquipItem,
    onDelete: removeEquipItem,
    onConfirm: formik.submitForm,
  });

  const [columns, setColumns]
    = React.useState<CustomTreeListColumnProps[]>(schema);

  const onExpandChange = (event: CustomTreeListExpandChangeEvent) => {
    const expanded = event.value
      ? state.expanded.filter((id) => id !== event.dataItem.id)
      : uniq([...state.expanded, event.dataItem.id]);

    setState(prevState => ({
      ...prevState,
      expanded,
    }));
  };

  const addExpandField = (dataTree: EquipmentItem[]) => {
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
    if (!dataState) {
      state.dataState = {
        sort: [],
        filter: [],
      };
      return [];
    }

    const filter = [...(dataState.filter as FilterDescriptor[])];
    const filteredData
      = dataState.filter && filterBy(data, filter, SUB_ITEMS_FIELD);
    const sortedData
      = dataState.sort
      && filteredData
      && orderBy(filteredData, dataState?.sort, SUB_ITEMS_FIELD);

    return addExpandField(sortedData as EquipmentItem[]);
  };

  const onColumnShowHide = ({ field }: CustomTreeListColumnProps) => {
    const dataColumns = map(columns, (column: CustomTreeListColumnProps) => {
      if (column.field === field) {
        column.isHidden = !column.isHidden;
      }
      return column;
    });
    updateColumns(dataColumns);
  };

  const createEquipItem = () => {
    return {
      id: FB.uniqid,
      plannedId: '',
      actualId: '',
      calDueDate: '',
      pmDueDate: '',
      actualItems: [],
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
    };
  };

  const addEquipItem = () => {
    const newEquipItem = createEquipItem();
    const isAddAllocationItemExists = state.data?.findIndex((data) => data[ADD_FIELD]);
    if (isAddAllocationItemExists === -1) {
      state.data.push(newEquipItem);
      setState(prevState => ({
        ...prevState,
        data: [...state.data],
        inEdit: [newEquipItem],
      }));
      formik.setValues(newEquipItem);
    }
  };

  const editEquipmentItem = ({ dataItem, level }: EquipmentItemEditEvent) => {
    const defaultValidation = dataItem[MODE_FIELD] || isDisabled;
    const isEditRestricted = !isEmpty(dataItem.type) && isLHRStep && isDesign ? false : defaultValidation;

    if (isEditRestricted) {
      return;
    }

    if (isLHRStep && isDesign && !dataItem.paramsId) {
      dataItem.paramsId = dataItem?.id;
    }

    const editItemInfo = extendDataItem(dataItem, SUB_ITEMS_FIELD);
    setState(state => ({
      ...state,
      data: [...state.data],
      inEdit: [editItemInfo],
    }));
    formik.setValues(editItemInfo);
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableEquipmentItem;
    // const parentChildRelkey = item.parentPartRevId ? `alloc-row-${item?.lotDocId}` : `alloc-row-${item.partRevId}-${item?.docId}`;

    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''), {
        [classes.WhiteBg]: isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.grayBg]: !isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.errorBg]: !isEmpty(item.type) && isLHRStep && isDesign,
      }),
    };

    const showWithoutActions = !item[MODE_FIELD];

    if (showWithoutActions) {
      return React.cloneElement(row, {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.id}`,
        // ['data-parent-rel' as string]: parentChildRelkey,
      });
    }

    return React.cloneElement(
      row,
      {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.id}`,
        // ['data-parent-rel' as string]: parentChildRelkey,
        className: cx(row.props.className, classes.updatingRow),
      },
    );
  };

  const cellRender = (
    tdElement: React.ReactElement<
    HTMLTableCellElement,
    string | React.JSXElementConstructor<any>
    > | null,
    cellProps: TreeListCellProps,
  ): React.ReactElement<HTMLTableCellElement> => {
    const props = {
      ...tdElement?.props,
      className: cx(tdElement?.props.className, classes.borderBottom),
    };
    const defaultRendering = { ...tdElement, props: props };
    return defaultRendering as React.ReactElement<HTMLTableCellElement>;
  };

  const updateColumns = (columns: CustomTreeListColumnProps[]) => {
    setColumns(columns);
  };

  const getColumns = () => {
    return columns.filter(({ isHidden }) => !isHidden) ?? [];
  };

  const onLock = React.useCallback(
    ({
      field,
      locked,
    }: CustomTreeListColumnProps) => {
      const index = columns.findIndex((c) => c.field === field);
      const column = columns[index];
      if (column) {
        const newColumns = [...columns];
        newColumns.splice(index, 1, {
          ...column,
          locked: !locked,
          reorderable: locked,
          orderIndex: !locked ? 0 : undefined,
        });
        updateColumns(newColumns);
      }
    },
    [columns],
  );

  return (
    <div className={classes.root} data-cy="lhr-equipment-table">
      <Grid item>
        <FormikProvider value={formik}>
          <ColumnMenuContext.Provider
            value={{
              columns: getColumns(),
              onLock,
              onColumnShowHide,
            }}
          >
            <Grid container>
              <Grid item xs={12} ref={treeListRef}>
                <TreeList
                  style={{
                    overflow: 'auto',
                    maxHeight: size?.height ? `${size?.height}px` : '100px',
                  }}
                  {...state.dataState}
                  tableProps={{ style: { tableLayout: 'fixed' } }}
                  rowHeight={TREELIST_CONFIG.rowHeight}
                  scrollable={TREELIST_CONFIG.scrollable as ScrollMode}
                  editField={MODE_FIELD}
                  expandField={EXPAND_FIELD}
                  dataItemKey={DATA_ITEM_KEY}
                  subItemsField={SUB_ITEMS_FIELD}
                  className={cx(classes.treeList, 'containing-box-scrollbar')}
                  onExpandChange={onExpandChange}
                  rowRender={rowRender}
                  data={processData()}
                  columns={getColumns()}
                  onRowClick={editEquipmentItem}
                  resizable={TREELIST_CONFIG.resizable}
                  reorderable={TREELIST_CONFIG.reorderable}
                  sortable={TREELIST_CONFIG.sortable}
                  cellRender={cellRender}
                />
              </Grid>
            </Grid>
          </ColumnMenuContext.Provider>
        </FormikProvider>
      </Grid>
      <Grid item>
        {!isDisabled && (
          <AddButton
            fullWidth
            attached
            kind="add"
            className={classes.bottomAddButtom}
            data-cy="fb-control-btn"
            onClick={addEquipItem}
          >
            {translate('form.builder.add.item')}
          </AddButton>
        )}
      </Grid>
    </div>
  );
};

export default React.memo(withThemeNext(React.forwardRef(FBEquipmentTable)));
