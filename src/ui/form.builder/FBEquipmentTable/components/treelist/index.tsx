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
  concat,
  isEmpty,
  isNil,
  keyBy,
  omit,
  replace, uniq,
} from 'lodash';
import { useObserver } from 'mobx-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import ScanCaptureDialog from '../../../../components/common/dialogs/scaner';
import { ScanSelectedPartItem } from '../../../../components/common/dialogs/scaner/components/lot.table/types';
import { CustomTreeListColumnProps } from '../../../../components/common/treelist/types';
import { Button as AddButton } from '../../../../components/forms/fields-next';
import useDialog from '../../../../hooks/useDialog';
import { withThemeNext } from '../../../../layout/theme-next';
import { FBProcedureItemConfig, FBProcedureItemType } from '../../../FBProcedureItem/FBProcedureItem.types';
import { FB } from '../../../helpers';
import { EditableEquipmentItem, EquipmentItem, EquipmentItemEditEvent } from '../../types';
import {
  ADD_FIELD,
  DATA_ITEM_KEY,
  EB_FIELDS_TO_OMIT,
  EB_PARENT_FIELDS_TO_OMIT,
  EB_SUB_ITEMS_FIELD,
  EXPAND_FIELD,
  MODE_FIELD, SUB_ITEMS_FIELD,
  TREELIST_CONFIG,
} from './constants';
import { useOptions } from './hooks/useOptions';
import {
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  EquipmentItemState,
  FBEquipmentProps,
} from './interface';
import { TreeListEBSchema } from './schemas/ebSchema';
import { TreeListLHRTSchema } from './schemas/lhrtSchema';
import { TreeListMPISchema } from './schemas/mpiSchema';
import { TreeListSchema } from './schemas/schema';
import useStyles from './styles';
import { getMapSelectedByParentEquipId, prepareData } from './utils';
import { withFBEquipmentTable } from './wrap';

const FBEquipmentTable: React.FC<FBEquipmentProps> = ({
  items,
  type,
  getItem,
  handleRemove,
  saveActualEquipment,
  saveScannedEquipments,
  handleSelectionDelete,
  isDisabled,
  isPreview,
  isDesign,
  isLHRStep,
  lhrStepIndex,
  isMPIProcedure,
  isPendingChange,
  equipsSelected,
  isEnableActualIdAddition,
  isEBProcedure,
}) => {
  const { _tabsState } = SM.useStores();
  const { procedureState, mpiProcedureState, workspaceState, lhrStepState } = FB.useStores();
  const treeListRef = useRef(null);
  const scanDialog = useDialog();
  const subItemsKey = isEBProcedure ? EB_SUB_ITEMS_FIELD : SUB_ITEMS_FIELD;
  const scanSelectedEquipInfo = useRef<ScanSelectedPartItem>();
  const size = useObserver(() => _tabsState?.contentSize);
  const classes = useStyles({ size });
  const { equipmentOptions } = useOptions();

  const [state, setState] = useState<EquipmentItemState>({
    data: prepareData(cloneDeep(items) ?? [], isEBProcedure),
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [],
    inEdit: [],
  });

  useEffect(() => {
    if (!items?.length) {
      return;
    }

    const mapByEquipmentId = getMapSelectedByParentEquipId(equipsSelected ?? [], items);
    const updatedItems = prepareData(cloneDeep(items) ?? [], isEBProcedure);
    const expandedRows = [] as string[];

    Object.keys(mapByEquipmentId)?.map(equipmentId => {
      const index = updatedItems?.findIndex((item) => {
        return item.title === equipmentId;
      });

      if (index !== -1) {
        const id = updatedItems[index]?.id;
        if (!expandedRows.includes(id)) {
          expandedRows.push(id);
        }

        const subItems = state.data[index][subItemsKey];
        if (subItems?.length) {
          mapByEquipmentId[equipmentId]?.forEach((item) => {
            const matchedItem = subItems?.find((entry) => entry.id === item.id);
            if (matchedItem) {
              item.actualId = matchedItem.actualId;
            }
          });
          updatedItems[index][subItemsKey] = mapByEquipmentId[equipmentId];
        } else {
          updatedItems[index][subItemsKey] = mapByEquipmentId[equipmentId];
        }
      }
    });

    setState(prevState => ({
      ...prevState,
      data: [...updatedItems],
      expanded: expandedRows.length ? expandedRows : prevState.expanded,
      inEdit: [],
    }));
  }, [equipsSelected, items]);

  useEffect(() => {
    updateColumns(schema);
  }, [state]);

  const formik = useFormik<Partial<EditableEquipmentItem>>({
    initialValues: {},
    onSubmit: (values: Partial<EditableEquipmentItem>) => {
      if (isEnableActualIdAddition && !isEBProcedure) {
        if (values[ADD_FIELD]) {
          saveActualEquipment?.(values as EditableEquipmentItem);
        }
        discardEquipItem(values as EditableEquipmentItem);
        return;
      }

      const { id = '', plannedId = '', title = '', LHRTparameter } = values;
      let newEquipItem: EditableEquipmentItem = {
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

      if (isEBProcedure && (values.isActualIdAddition || values.equipmentId)) {
        newEquipItem = {
          id,
          equipmentId: values.equipmentId,
        };
        const parentIndex = state.data?.findIndex((data) => data.id === values.parentId);
        if (parentIndex !== -1) {
          if (values[ADD_FIELD] || values.equipmentId) {
            const subItems = state.data[parentIndex][subItemsKey];

            if (Array.isArray(subItems)) {
              const existingSubIndex = subItems.findIndex((item) => item.id === values.id);

              if (existingSubIndex !== -1) {
                subItems[existingSubIndex] = newEquipItem;
              } else {
                subItems.push(newEquipItem);
              }
              state.data[parentIndex][subItemsKey] = subItems.map(
                (item) => omit(item, EB_FIELDS_TO_OMIT) as unknown as FBProcedureItemConfig,
              );
            } else {
              state.data[parentIndex][subItemsKey] = [newEquipItem];
            }
          }
        }

        const payload = omit(state.data[parentIndex], EB_PARENT_FIELDS_TO_OMIT) as FBProcedureItemConfig;
        discardEquipItem(values as EditableEquipmentItem);
      procedureState?.addItem(payload, type, allSteps);
      mpiProcedureState?.addItem(payload, type, allSteps);

      return;
      }

      discardEquipItem(values as EditableEquipmentItem);
      procedureState?.addItem(newEquipItem as FBProcedureItemConfig, type, allSteps);
      mpiProcedureState?.addItem(newEquipItem as FBProcedureItemConfig, type, allSteps);
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
        if (schemaItem && workspaceState?.schema && workspaceState.schema[lhrStepIndex]) {
          workspaceState.schema[lhrStepIndex] = {
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
  };

  const discardEquipItem = (dataItem?: EditableEquipmentItem) => {
    setState((prevState) => {
      const newData = [...prevState.data];

      if (dataItem?.[ADD_FIELD]) {
        if (dataItem.isActualIdAddition) {
          const parentIndex = newData.findIndex((data) => {
            return data.plannedId === dataItem.parentEquipPlannedId;
          });

          if (parentIndex !== -1) {
            newData[parentIndex][subItemsKey] = newData[parentIndex][subItemsKey]?.filter(
              (data) => dataItem.id ? dataItem.id !== data.id : !data[ADD_FIELD],
            );
          }
        } else {
          const filtered = newData.filter((data) => (dataItem.id ? dataItem.id !== data.id : !data[ADD_FIELD]));

          return {
            ...prevState,
            data: filtered,
            inEdit: [],
          };
        }
      }

      return {
        ...prevState,
        data: [...newData],
        inEdit: [],
      };
    });

    formik?.resetForm();
  };

  const deleteItemFromStateData = (dataItem) => {
    if (isEnableActualIdAddition) {
      const parentIndex = state.data?.findIndex((data) => data.id === dataItem.parentId);
      if (parentIndex === -1) {
        return;
      }
      const subItems = state.data[parentIndex][subItemsKey];
      state.data[parentIndex][subItemsKey] = subItems?.filter((item) => item.id !== dataItem.id);
    } else {
      state.data = state.data.filter((item) => item.id !== dataItem.id);
    }

    setState((prevState) => ({
      ...prevState,
      inEdit: [],
      data: [...state.data],
    }));
    formik.resetForm();
  };

  const removeEquipItem = (dataItem: EditableEquipmentItem) => {
    if (isEnableActualIdAddition && !isEBProcedure) {
      handleSelectionDelete?.(dataItem.id);
    } else if (isEBProcedure && dataItem.equipmentId) {
      procedureState?.removeEBChildrenItem(dataItem.parentId ?? '', dataItem.id, type, subItemsKey);
    } else {
      handleRemove?.(dataItem.id ?? '');
    }
    deleteItemFromStateData(dataItem);
  };

  const ignorePreviouslyAddedItems = (data: EditableEquipmentItem[]) => {
    return data?.filter((data) => {
      const isEquipmentItemAddExist = !data[ADD_FIELD];
      if (data[subItemsKey]) {
        data[subItemsKey] = data[subItemsKey]?.filter((lot) => !lot[ADD_FIELD]);
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
      state.data[index][subItemsKey] = state.data[index][subItemsKey]?.filter((data) => !data[ADD_FIELD]);

      if (isNil(state.data[index][subItemsKey])) {
        state.data[index][subItemsKey] = [];
      }

      state.data[index][subItemsKey]?.unshift(newActualItem);

      setState(prevState => ({
        ...prevState,
        data: [...state.data],
        expanded: [state.data[index].id],
        inEdit: [newActualItem],
      }));
    }
  };

  const openScanDialog = (dataItem: EditableEquipmentItem) => {
    const plannedIdInfo = equipmentOptions?.find((option) => option.value === dataItem.title);
    const match = plannedIdInfo?.label?.match(/^(.+?) Rev (.+?) - (.+)$/) ?? ['', '', ''];

    scanSelectedEquipInfo.current = {
      docId: match[1] ?? '',
      partDescription: match[3],
      displayRevision: match[2],
      partRevId: plannedIdInfo?.value,
      id: dataItem.id,
      plannedId: dataItem.title,
      type: FBProcedureItemType.equipment,
    };
    scanDialog.open();
  };

  const getSchemaBuilder = () => {
    if (isMPIProcedure && !isLHRStep) return TreeListMPISchema;
    if (isLHRStep) return TreeListLHRTSchema;
    if (isEBProcedure) return TreeListEBSchema;
    return TreeListSchema;
  };

  const schema: CustomTreeListColumnProps[] = getSchemaBuilder()({
    actionsClass: classes.actionsCell,
    popperHolder: classes.popperHolder,
    parentRevId: '',
    isMPIForm: Boolean(isMPIProcedure && !isLHRStep),
    getItem,
    addActualId: addActualId,
    equipmentOptions,
    onDiscard: discardEquipItem,
    onDelete: removeEquipItem,
    onConfirm: formik.submitForm,
    onScanClick: openScanDialog,
    isDisabled,
    isEnableActualIdAddition,
    isEBProcedure,
  });

  const [columns, setColumns]
    = useState<CustomTreeListColumnProps[]>(schema);

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
    return mapTree(dataTree, subItemsKey, (item) =>
      extendDataItem(item, subItemsKey, {
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
      = dataState.filter && filterBy(data, filter, subItemsKey);
    const sortedData
      = dataState.sort
      && filteredData
      && orderBy(filteredData, dataState?.sort, subItemsKey);

    return addExpandField(sortedData as EquipmentItem[]);
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
    const isAddEquipmentItemExists = state.data?.findIndex((data) => data[ADD_FIELD]);
    if (isAddEquipmentItemExists === -1) {
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
    const defaultValidation = ((isEnableActualIdAddition && dataItem.plannedId) && (!isPreview || isDisabled)) || (!isEnableActualIdAddition && isPreview);
    const isEditRestricted = dataItem[MODE_FIELD] || (isLHRStep && isDesign ? !((isPreview || isPendingChange) && (dataItem.type || dataItem.paramsId)) : defaultValidation);

    if ((isEditRestricted && !isEBProcedure) || (isEBProcedure && isDisabled)) {
      return;
    }

    if ((isMPIProcedure && !isLHRStep) && isDisabled && !isPreview) {
      return;
    }

    if (isLHRStep && isDesign && !dataItem.paramsId) {
      dataItem.paramsId = dataItem?.id;
    }

    const editItemInfo = extendDataItem(dataItem, subItemsKey);

    if (isMPIProcedure || isLHRStep || isEBProcedure) {
      const index = state?.data?.findIndex(data => { return data.id === dataItem.id; });
      if (!dataItem[ADD_FIELD] && state.data.length && index !== -1) {
        state.data[index] = editItemInfo;
      }
    }

    setState(state => ({
      ...state,
      data: [...state.data],
      inEdit: [editItemInfo],
    }));
    formik.setValues(editItemInfo);
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableEquipmentItem;
    const parentChildRelkey = item.parentEquipPlannedId ? `equip-row-${item?.actualId}` : `equip-row-${item?.plannedId}`;

    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''), {
        [classes.whiteBg]: isEmpty(item[subItemsKey]),
        [classes.grayBg]: !isEmpty(item[subItemsKey]),
        [classes.errorBg]: !isEmpty(item.type) && isLHRStep && isDesign,
      }),
    };

    const showWithoutActions = !item[MODE_FIELD];

    if (showWithoutActions) {
      return React.cloneElement(row, {
        ...modifiedProps,
        ['data-cy' as string]: `equip-row-${item?.id}`,
        ['data-parent-rel' as string]: parentChildRelkey,
      });
    }

    return React.cloneElement(
      row,
      {
        ...modifiedProps,
        ['data-cy' as string]: `equip-row-${item?.id}`,
        ['data-parent-rel' as string]: parentChildRelkey,
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

  const addScannedEquipments = (scannedEquips) => {
    scanDialog.close();
    const parentIndex = state.data?.findIndex((data) => data.id === scanSelectedEquipInfo.current?.id);
    if (parentIndex === -1) {
      return;
    }

    const updatedScannedEquips = scannedEquips.map((equipment) => {
      return {
        ...equipment,
        parentEquipPlannedId: scanSelectedEquipInfo.current?.plannedId,
      };
    });

    if (isEBProcedure) {
      const newSubItems = scannedEquips.map((equipment) => ({
        id: FB.uniqid,
        equipmentId: equipment.actualId,
      }));

      const parentItem = state.data[parentIndex];
      const existingSubItems = parentItem[subItemsKey] ?? [];
      const updatedSubItems = concat(newSubItems, existingSubItems).map((item) => omit(item, EB_FIELDS_TO_OMIT));
      state.data[parentIndex][subItemsKey] = updatedSubItems;
      const payload = omit(parentItem, EB_PARENT_FIELDS_TO_OMIT) as FBProcedureItemConfig;
      const allSteps = workspaceState?.schema?.filter((item) => item.type === 'mpiprocedure');
      procedureState?.addItem(payload, type, allSteps);
      mpiProcedureState?.addItem(payload, type, allSteps);
      return;
    }

    saveScannedEquipments?.(updatedScannedEquips);
  };

  return (
    <div className={classes.root} data-cy="lhr-equipment-table">
      <Grid item>
        <FormikProvider value={formik}>
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
                subItemsField={subItemsKey}
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
      {scanDialog.isOpen && (
        <ScanCaptureDialog
          handler={scanDialog}
          onClose={scanDialog.close}
          isSerialNumberHidden
          addScanLotsToPart={addScannedEquipments}
          selectedPart ={scanSelectedEquipInfo.current as ScanSelectedPartItem}
        />
      )}
    </div>
  );
};

export default memo(withThemeNext(React.forwardRef(withFBEquipmentTable(FBEquipmentTable))));
