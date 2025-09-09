import { Box, Grid } from '@material-ui/core';
import { FilterDescriptor } from '@progress/kendo-data-query';
import {
  extendDataItem,
  filterBy,
  mapTree,
  orderBy,
  TreeList,
  TreeListCellProps,
  TreeListDataStateChangeEvent,
} from '@progress/kendo-react-treelist';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { cloneDeep, isEmpty, isNil, keyBy, omit, replace, uniq } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { SM } from '../../../../App';
import { translate } from '../../../../common/intl';
import DocumentRevisionDialog from '../../../components/common/dialogs/DocumentRevisionDialog';
import ScanCaptureDialog from '../../../components/common/dialogs/scaner';
import { ScanSelectedPartItem } from '../../../components/common/dialogs/scaner/components/lot.table/types';
import { CustomTreeListColumnProps } from '../../../components/common/treelist/types';
import { Button } from '../../../components/forms/fields-next';
import { MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import useDialog from '../../../hooks/useDialog';
import { withThemeNext } from '../../../layout/theme-next';
import { FBProcedureItemConfig, FBProcedureItemType } from '../../FBProcedureItem/FBProcedureItem.types';
import { FB } from '../../helpers';
import { prepareData } from './components/utils';
import {
  ADD_FIELD,
  DATA_ITEM_KEY,
  EB_FIELDS_TO_OMIT,
  EXPAND_FIELD,
  FIELDS_TO_OMIT,
  IS_LOT_ADDITION,
  LOT_FIELDS_TO_OMIT,
  SUB_ITEMS_FIELD,
} from './constants';
import { buildEBSchema } from './ebSchema';
import { buildLHRTSchema } from './lhrtSchema';
import { buildMPISchema } from './mpiSchema';
import { buildSchema } from './schema';
import useStyles from './styles';
import {
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  EditableMaterial,
  Material,
  MaterialEditEvent,
  MaterialItemState,
  MaterialTableProps,
} from './types';
import { useOptions } from './useOptions';
import { withMaterialsTable } from './wrap';

const MaterialsTable: React.FC<MaterialTableProps> = ({
  items,
  type,
  saveLot,
  editLot,
  saveScannedLots,
  handleSelectionDelete,
  getItem,
  handleRemove,
  isActive,
  isDesign,
  lhrStepIndex,
  isLHRStep,
  isDisabled,
  isPendingChange,
  isEnableOnlyLotAddition,
  partsSelected,
  isMPIProcedure,
  isPreview,
  isEBProcedure,
}) => {
  const { _tabsState } = SM.useStores();
  const size = useObserver(() => _tabsState?.contentSize);
  const { procedureState, mpiProcedureState, lhrStepState, workspaceState } = FB.useStores();
  const classes = useStyles({ size });
  const treeListRef = useRef(null);
  const { materialSelectOptions } = useOptions();
  const [selectedDataItem, setSelectedDataItem] = useState<EditableMaterial>();
  const quickViewDialog = useDialog();
  const [state, setState] = React.useState<MaterialItemState>({
    data: prepareData(cloneDeep(items), isDesign, isEBProcedure),
    expanded: [],
    dataState: {
      sort: [],
      filter: [],
    },
    inEdit: [],
  });

  React.useEffect(() => {
    if (isMPIProcedure || isLHRStep || isEBProcedure) {
      setState((prevState) => ({
        ...prevState,
        data: prepareData(cloneDeep(items), isDesign, isEBProcedure),
        inEdit: [],
      }));
    }
  }, [items]);

  const updateState = (stateInfo) => {
    setState(stateInfo);
  };

  const handleExpandChange = (event: CustomTreeListExpandChangeEvent) => {
    const expanded = event.value
      ? state.expanded.filter((id) => id !== event.dataItem.id)
      : uniq([...state.expanded, event.dataItem.id]);

    updateState({
      ...state,
      expanded,
    });
  };

  const appendItemToStateData = (scanLot) => {
    const existingIndex = state.data.findIndex((item) => item.id === scanLot.id);
    if (existingIndex !== -1) {
      state.data[existingIndex] = {
        ...state.data[existingIndex],
        ...scanLot,
        [ADD_FIELD]: false,
      };
    } else {
      state.data.push(scanLot as Material);
    }

    setState((prevState) => ({
      ...prevState,
      inEdit: [],
      data: [...state.data],
    }));
    formik.resetForm();
  };

  const saveProcedureItem = (procedureItem: FBProcedureItemConfig) => {
    if (isLHRStep) {
      const updatedItem = omit(procedureItem, ['type', 'LHRTparameter']);
      const schemaItem = workspaceState?.getSchemaItemAt(lhrStepIndex);
      lhrStepState?.editItem(updatedItem, type);
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
      formik.resetForm();
      return;
    }

    const allSteps = workspaceState?.schema?.filter((item) => item.type === 'mpiprocedure');
    procedureState?.addItem(procedureItem, type, allSteps);
    mpiProcedureState?.addItem(procedureItem, type, allSteps);

    if (isMPIProcedure) {
      return;
    }

    const updatedProcedureItem = {
      ...procedureItem,
      plannedId: procedureItem.title,
    };
    appendItemToStateData(updatedProcedureItem);
  };

  const formik = useFormik<Partial<EditableMaterial>>({
    initialValues: {},
    onSubmit: (values) => {
      if (isEnableOnlyLotAddition) {
        if (values[ADD_FIELD]) {
          saveLot?.(values as EditableMaterial);
        } else {
          editLot?.(values as EditableMaterial);
        }
        discardScanLot(values as EditableMaterial);
        return;
      }
      const allSteps = workspaceState?.schema?.filter((item) => item.type === 'mpiprocedure');
      if (values[IS_LOT_ADDITION] || values.parentPartPlannedId) {
        const scanLot = omit(values, LOT_FIELDS_TO_OMIT) as FBProcedureItemConfig;
        const parentIndex = state.data?.findIndex((data) => data.id === values.parentId);

        if (parentIndex !== -1) {
          const subItems = state.data[parentIndex][SUB_ITEMS_FIELD];

          if (Array.isArray(subItems)) {
            const existingSubIndex = subItems.findIndex((item) => item.id === values.id);

            if (existingSubIndex !== -1) {
              subItems[existingSubIndex] = {
                ...omit(subItems[existingSubIndex], LOT_FIELDS_TO_OMIT),
                ...scanLot,
              };
            } else {
              subItems.push(scanLot);
            }
            state.data[parentIndex][SUB_ITEMS_FIELD] = subItems.map(
              (item) => omit(item, LOT_FIELDS_TO_OMIT) as unknown as FBProcedureItemConfig,
            );
          } else {
            state.data[parentIndex][SUB_ITEMS_FIELD] = [scanLot];
          }
        }

        let payload = state.data[parentIndex];
        if (isEBProcedure) {
          payload = omit(payload, EB_FIELDS_TO_OMIT) as FBProcedureItemConfig;
        }

        procedureState?.addItem(payload as FBProcedureItemConfig, type, allSteps);
        mpiProcedureState?.addItem(payload as FBProcedureItemConfig, type, allSteps);
        discardScanLot(values as EditableMaterial);
      } else {
        if (isDesign) {
          const procedureItem = { ...omit(values, [...LOT_FIELDS_TO_OMIT, 'actualId']) };
          saveProcedureItem(procedureItem as FBProcedureItemConfig);
          return;
        }

        const omitFields = isEBProcedure ? EB_FIELDS_TO_OMIT : [...FIELDS_TO_OMIT, 'actualId'];
        const scanLot = omit(values, omitFields);
        if (scanLot[SUB_ITEMS_FIELD]) {
          scanLot[SUB_ITEMS_FIELD] = scanLot[SUB_ITEMS_FIELD]?.map(
            (item) => omit(item, LOT_FIELDS_TO_OMIT) as unknown as FBProcedureItemConfig,
          );
        }
        saveProcedureItem(scanLot as FBProcedureItemConfig);
      }
    },
  });

  const addScanLotsToPart = (scanLots) => {
    scanDialog.close();
    const parentIndex = state.data?.findIndex((data) => data.id === scanSelectedPartInfo.current?.id);
    if (parentIndex === -1) {
      return;
    }

    const updatedLots = scanLots.map((lot) => {
      return {
        ...lot,
        parentPartPlannedId: scanSelectedPartInfo.current?.plannedId,
      };
    });

    saveScannedLots?.(updatedLots);
  };

  const discardScanLot = (dataItem?: EditableMaterial) => {
    setState((prevState) => {
      const newData = [...prevState.data];

      if (dataItem?.[ADD_FIELD]) {
        if (dataItem.isLotAddition) {
          const parentIndex = newData.findIndex((data) => {
            return data.plannedId === dataItem.parentPartPlannedId;
          });

          if (parentIndex !== -1) {
            newData[parentIndex][SUB_ITEMS_FIELD] = newData[parentIndex][SUB_ITEMS_FIELD]?.filter(
              (data) => !data[ADD_FIELD],
            );
          }
        } else {
          const filtered = newData.filter((data) =>
            dataItem.id ? dataItem.id !== data.id : !data[ADD_FIELD],
          );
          return {
            ...prevState,
            data: filtered,
            inEdit: [],
          };
        }
      }
      formik.resetForm();

      return {
        ...prevState,
        data: [...newData],
        inEdit: [],
      };
    });
  };

  const deleteItemFromStateData = (scanLot) => {
    if (isEnableOnlyLotAddition) {
      const parentIndex = state.data?.findIndex((data) => data.id === scanLot.parentId);
      if (parentIndex === -1) {
        return;
      }
      const subItems = state.data[parentIndex][SUB_ITEMS_FIELD];
      state.data[parentIndex][SUB_ITEMS_FIELD] = subItems.filter((item) => item.id !== scanLot.id);
    } else {
      state.data = state.data.filter((item) => item.id !== scanLot.id);
    }

    setState((prevState) => ({
      ...prevState,
      inEdit: [],
      data: [...state.data],
    }));
    formik.resetForm();
  };

  const removeScanLot = (material: EditableMaterial) => {
    if (isEnableOnlyLotAddition) {
      handleSelectionDelete?.(material.id);
    } else {
      handleRemove?.(material.id);
    }
    deleteItemFromStateData(material);
  };

  const openQuickView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableMaterial) => {
    setSelectedDataItem(dataItem);
    quickViewDialog.open();
    event.preventDefault();
    event.stopPropagation();
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableMaterial;

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
      });
    }

    const editedRow = React.cloneElement(row, {
      ...modifiedProps,
      ['data-cy' as string]: `alloc-row-${item?.id}`,
      className: cx(row.props.className, classes.updatingRow),
    });

    return (
      <FormikProvider value={formik}>
        {editedRow}
      </FormikProvider>
    );
  };

  const handleDataStateChange = (event: TreeListDataStateChangeEvent) => {
    updateState({
      ...state,
      dataState: event.dataState,
    });
  };

  const addExpandField = (dataTree: Material[]) => {
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
    const filteredData = dataState.filter && filterBy(data, filter, SUB_ITEMS_FIELD);
    const sortedData = dataState.sort && filteredData && orderBy(filteredData, dataState?.sort, SUB_ITEMS_FIELD);

    return addExpandField(sortedData as Material[]);
  };

  const cellRender = (
    tdElement: React.ReactElement<HTMLTableCellElement, string | React.JSXElementConstructor<any>> | null,
    cellProps: TreeListCellProps,
  ): React.ReactElement<HTMLTableCellElement> => {
    const props = {
      ...tdElement?.props,
      className: cx(tdElement?.props.className, classes.borderBottom),
    };
    const defaultRendering = { ...tdElement, props: props };
    return defaultRendering as React.ReactElement<HTMLTableCellElement>;
  };

  const createPartItem = (): EditableMaterial => {
    return {
      id: FB.uniqid,
      plannedId: '',
      actualId: '',
      ...(isMPIProcedure && !isLHRStep && { title: '' }),
      unit: '',
      quantity: undefined,
      isLotAddition: false,
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
    };
  };

  const addPartItem = () => {
    const newMaterialItem = createPartItem();
    const isAddMaterialExists = state.data?.findIndex((data) => data[ADD_FIELD]);
    if (isAddMaterialExists === -1) {
      state.data.push(newMaterialItem);
      setState((prevState) => ({
        ...prevState,
        data: [...state.data],
        inEdit: [newMaterialItem],
      }));
      formik.setValues(newMaterialItem);
    }
  };

  const editPartItem = ({ dataItem }: MaterialEditEvent) => {
    const defaultValidation = ((isEnableOnlyLotAddition && dataItem.plannedId) && (!isActive || isDisabled)) || (!isEnableOnlyLotAddition && isPreview);
    const isEditRestricted = dataItem[MODE_FIELD] || (isLHRStep && isDesign ? !((isActive || isPendingChange) && (dataItem.type || dataItem.paramsId)) : defaultValidation);
    if (isEditRestricted) {
      return;
    }

    if (isMPIProcedure && isDisabled && !isPreview) {
      return;
    }

    if (isLHRStep && isDesign && !dataItem.paramsId) {
      dataItem.paramsId = dataItem?.id;
    }

    const editItemInfo = extendDataItem(dataItem, SUB_ITEMS_FIELD);

    if (isMPIProcedure || isLHRStep) {
      const index = state?.data?.findIndex(data => { return data.id === dataItem.id; });
      if (!dataItem[ADD_FIELD] && state.data.length && index !== -1) {
        state.data[index] = editItemInfo;
      }
    }

    setState((state) => ({
      ...state,
      data: [...state.data],
      inEdit: [editItemInfo],
    }));
    formik.setValues(editItemInfo);
  };

  const createNewLotItem = () => {
    return {
      id: FB.uniqid,
      plannedId: '',
      actualId: '',
      unit: '',
      quantity: undefined,
      isLotAddition: true,
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
    };
  };

  const ignorePreviouslyAddedItems = (data: Material[]) => {
    return data?.filter((data) => {
      const isAlocationItemAddExist = !data[ADD_FIELD];
      if (data[SUB_ITEMS_FIELD]) {
        data[SUB_ITEMS_FIELD] = data[SUB_ITEMS_FIELD]?.filter((lot) => !lot[ADD_FIELD]);
      }
      return isAlocationItemAddExist;
    });
  };

  useEffect(() => {
    if (!partsSelected?.length || !items?.length) {
      return;
    }

    const mapByMaterialId = partsSelected?.reduce((acc, selected) => {
      const materialId = selected?.materialId ?? '';
      if (!acc[materialId]) {
        acc[materialId] = [];
      }
      const index = items?.findIndex((item) => {
        return item.title === selected.materialId;
      });

      const lotItem = {
        id: selected.refId,
        plannedId: '',
        actualId: selected.actualId,
        lotId: selected.lotId,
        lotDocId: selected.lotDocId,
        parentPartPlannedId: selected.materialId,
        parentId: index !== -1 ? state.data[index].id : '',
        unit: selected.unit,
        quantity: selected.quantity,
        [MODE_FIELD]: false,
      };
      acc[materialId].push(lotItem);
      return acc;
    }, {});

     Object.keys(mapByMaterialId)?.map(materialId => {
       const index = items?.findIndex((item) => {
         return item.title === materialId;
       });

       if (index !== -1) {
         const subItems = state.data[index][SUB_ITEMS_FIELD];

         if (subItems) {
         subItems?.forEach((item) => {
           const matchedItem = mapByMaterialId[materialId]?.find((entry) => entry.id === item.id);
           if (matchedItem) {
             item.quantity = matchedItem.quantity;
             item.unit = matchedItem.unit;
           }
         });
         } else {
           state.data[index][SUB_ITEMS_FIELD] = mapByMaterialId[materialId];
         }

         updateState({
           ...state,
           data: [...state.data],
           expanded: [state.data[index].id],
         });
       }
     });
  }, [partsSelected]);

  const addLot = (dataItem: EditableMaterial) => {
    const index = state?.data?.findIndex((data) => {
      return data.id === dataItem.id;
    });
    state.data = ignorePreviouslyAddedItems(state.data);

    if (state.data.length && index !== -1) {
      const newAllocItem: EditableMaterial = createNewLotItem();
      newAllocItem.parentPartPlannedId = dataItem.plannedId;
      newAllocItem.parentId = dataItem.id;
      state.data[index][SUB_ITEMS_FIELD] = state.data[index][SUB_ITEMS_FIELD]?.filter((data) => !data[ADD_FIELD]);

      if (isNil(state.data[index][SUB_ITEMS_FIELD])) {
        state.data[index][SUB_ITEMS_FIELD] = [];
      }

      state.data[index][SUB_ITEMS_FIELD]?.unshift(newAllocItem);

      updateState({
        ...state,
        data: [...state.data],
        expanded: [state.data[index].id],
        inEdit: [newAllocItem],
      });
    }
  };

  const scanDialog = useDialog();
  const scanSelectedPartInfo = useRef<ScanSelectedPartItem>();

  const openScanDialog = (dataItem: EditableMaterial) => {
    const plannedIdInfo = materialSelectOptions?.find((option) => option.value === dataItem.plannedId);
    const match = plannedIdInfo?.label?.match(/^(.+?) Rev (.+?) - (.+)$/) ?? ['', '', ''];

    scanSelectedPartInfo.current = {
      docId: match[1] ?? '',
      partDescription: match[3],
      quantityNeeded: dataItem.quantity,
      displayRevision: match[2],
      variance: '',
      partRevId: plannedIdInfo?.value,
      id: dataItem.id,
      plannedId: dataItem?.plannedId,
      type: FBProcedureItemType.materials,
    };
    scanDialog.open();
  };

  const getSchemaBuilder = () => {
    if (isMPIProcedure && !isLHRStep) return buildMPISchema;
    if (isLHRStep) return buildLHRTSchema;
    if (isEBProcedure) return buildEBSchema;
    return buildSchema;
  };

  const schema = getSchemaBuilder()({
    materialSelectOptions,
    actionsClass: classes.actionsCell,
    popperHolder: classes.popperHolder,
    onDiscard: discardScanLot,
    onDelete: removeScanLot,
    addLot: addLot,
    isDisabled: isEBProcedure ? isDisabled : (isDesign || !isEnableOnlyLotAddition),
    isLHRT: isLHRStep && isMPIProcedure,
    onOpenQuickView: openQuickView,
    onConfirm: formik.submitForm,
    onScanClick: openScanDialog,
  });

  const [columns] = React.useState<CustomTreeListColumnProps[]>(schema);

  return (
    <Box className={classes.root} data-cy="material-grid">
      <FormikProvider value={formik}>
        <Grid item xs={12} ref={treeListRef}>
          <TreeList
            style={{
              overflow: 'auto',
              maxHeight: size?.height ? `${size?.height}px` : '100px',
            }}
            tableProps={{ style: { tableLayout: 'fixed' } }}
            {...state.dataState}
            className={cx(classes.treeList, 'containing-box-scrollbar')}
            data={processData()}
            dataItemKey={DATA_ITEM_KEY}
            subItemsField={SUB_ITEMS_FIELD}
            expandField={EXPAND_FIELD}
            editField={MODE_FIELD}
            rowHeight={50}
            onExpandChange={handleExpandChange}
            onDataStateChange={handleDataStateChange}
            onRowClick={editPartItem}
            rowRender={rowRender}
            cellRender={cellRender}
            columns={columns}
          />
          {isActive && !isDisabled && !isLHRStep && (isDesign || !isEnableOnlyLotAddition) && (
            <Button kind="add" fullWidth attached onClick={addPartItem} data-cy="add-material">
              {translate('form.builder.procedure.material.table.add.part')}
            </Button>
          )}
          <DocumentRevisionDialog
            dialog={quickViewDialog}
            {...{
              docRevId: selectedDataItem?.lotNumber?.id,
            }}
          />
        </Grid>
      </FormikProvider>
      {scanDialog.isOpen && (
        <ScanCaptureDialog
          handler={scanDialog}
          isSerialNumberHidden
          onClose={scanDialog.close}
          addScanLotsToPart={addScanLotsToPart}
          selectedPart ={scanSelectedPartInfo.current as ScanSelectedPartItem}
        />
      )}
    </Box>
  );
};

export default memo(withThemeNext(React.forwardRef(withMaterialsTable(MaterialsTable))));
