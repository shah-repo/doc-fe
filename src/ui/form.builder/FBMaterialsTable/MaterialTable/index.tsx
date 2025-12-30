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
import { cloneDeep, get, isEmpty, isNil, keyBy, omit, replace, uniq } from 'lodash';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SM } from '../../../../App';
import { translate } from '../../../../common/intl';
import { companySelectors } from '../../../../state/ducks/company';
import DocumentRevisionDialog from '../../../components/common/dialogs/DocumentRevisionDialog';
import ScanCaptureDialog from '../../../components/common/dialogs/scaner';
import { ScanSelectedPartItem } from '../../../components/common/dialogs/scaner/components/lot.table/types';
import { CustomTreeListColumnProps } from '../../../components/common/treelist/types';
import { Button } from '../../../components/forms/fields-next';
import { MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { toastError } from '../../../components/notifications';
import useDialog from '../../../hooks/useDialog';
import { withThemeNext } from '../../../layout/theme-next';
import { LHRS_ACCEPTED_QUANTITY } from '../../FBLHRStep/utils';
import { FBProcedureItemConfig, FBProcedureItemType } from '../../FBProcedureItem/FBProcedureItem.types';
import { FB } from '../../helpers';
import { isPartHasInsufficientQty, prepareData } from './components/utils';
import {
  ADD_FIELD,
  DATA_ITEM_KEY,
  EB_FIELDS_TO_OMIT,
  EXPAND_FIELD,
  FIELDS_TO_OMIT,
  IS_LOT_ADDITION,
  LHRS_START_QUANTITY_NAME,
  LOT_FIELDS_TO_OMIT,
  SUB_ITEMS_FIELD,
} from './constants';
import { useFetchData } from './hooks/useFetchData';
import { useMaterialActions } from './hooks/useMaterialActions';
import { buildEBSchema } from './schemas/ebSchema';
import { buildLHRTSchema } from './schemas/lhrtSchema';
import { buildMPISchema } from './schemas/mpiSchema';
import { buildSchema } from './schemas/schema';
import useStyles from './styles';
import {
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  EditableMaterial,
  Material,
  MaterialItemState,
  MaterialTableProps,
} from './types';
import { withMaterialsTable } from './wrap';

interface MaterialTreelistContextProps {
  lhrsQuantity?: number
  addLot?: (dataItem: EditableMaterial) => void
  openQuickView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableMaterial) => void
  isRedlineActive?: boolean
  isDisabled?: boolean
  isEBProcedure?: boolean
}

export const MaterialTreelistContext = React.createContext<MaterialTreelistContextProps>({
  lhrsQuantity: 1,
  addLot: undefined,
  isRedlineActive: false,
  isDisabled: false,
  isEBProcedure: false,
});

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
  const { materialSelectOptions } = useFetchData();
  const [selectedDataItem, setSelectedDataItem] = useState<EditableMaterial>();
  const quickViewDialog = useDialog();
  const isLHRProductionBuild = workspaceState?.isLHRProductionBuild || false;
  const [state, setState] = React.useState<MaterialItemState>({
    data: prepareData(cloneDeep(items), isDesign, isEBProcedure),
    expanded: [],
    dataState: {
      sort: [],
      filter: [],
    },
    inEdit: [],
  });
  const isRedlineActive = useSelector(companySelectors.getRedlineActive);

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

  const saveProcedureItem = (procedureItem: FBProcedureItemConfig) => {
    if (isLHRStep) {
      const updatedItem = omit(procedureItem, ['type', 'LHRTparameter']);
      const schemaItem = workspaceState?.getSchemaItemAt(lhrStepIndex);
      lhrStepState?.editItem(updatedItem, type);
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
      title: procedureItem.title,
    };
    appendItemToStateData(updatedProcedureItem);
  };

  const hasDuplicateLot = (state, values) => {
    const parentIndex = state.data?.findIndex((data) => data.id === values.parentId);
    if (parentIndex === -1) return false;

    const subItems = state.data[parentIndex][SUB_ITEMS_FIELD];
    return subItems?.some((item) => item.lotId === values.lotId && item.id !== values.id);
  };

  const formik = useFormik<Partial<EditableMaterial>>({
    initialValues: {},
    onSubmit: (values) => {
      if (isEnableOnlyLotAddition) {
        if (values[ADD_FIELD]) {
          if (hasDuplicateLot(state, values)) {
            toastError(
              translate('form.builder.lhrs.procedure.select.lot.duplicate.error.message', {
                lotId: values.selectedLotLabel,
              }),
            );
            return;
          }

          saveLot?.(values as EditableMaterial);
        } else {
          editLot?.(values as EditableMaterial);
        }
        discardScanLot(values as EditableMaterial);
        return;
      }

      if (values[IS_LOT_ADDITION] || values.parentPartId) {
        const scanLot = omit(values, LOT_FIELDS_TO_OMIT) as FBProcedureItemConfig;
        const parentIndex = state.data?.findIndex((data) => data.id === values.parentId);

        if (parentIndex !== -1) {
          let subItems = state.data[parentIndex][SUB_ITEMS_FIELD];

          if (Array.isArray(subItems)) {
            const existingSubIndex = subItems.findIndex((item) => item.id === values.id);

            if (existingSubIndex !== -1) {
              const shouldMoveToEnd = isEBProcedure && subItems[existingSubIndex][ADD_FIELD];

              if (shouldMoveToEnd) {
                subItems = subItems.filter((item) => item.id !== values.id);
                subItems.push(scanLot);
              } else {
                subItems[existingSubIndex] = {
                  ...omit(subItems[existingSubIndex], LOT_FIELDS_TO_OMIT),
                  ...scanLot,
                };
              }
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
          if (hasDuplicateLot(state, values)) {
            toastError(
              translate('form.builder.lhrs.procedure.select.lot.duplicate.error.message', {
                lotId: values.selectedLotLabel,
              }),
            );
            return;
          }

          payload = omit(payload, EB_FIELDS_TO_OMIT) as FBProcedureItemConfig;
        }

        discardScanLot(values as EditableMaterial);
        const allSteps = workspaceState?.schema?.filter((step) => step.type === 'mpiprocedure');
        procedureState?.addItem(payload as FBProcedureItemConfig, type, allSteps);
        mpiProcedureState?.addItem(payload as FBProcedureItemConfig, type, allSteps);
      } else {
        if (isDesign) {
          const procedureItem = { ...omit(values, LOT_FIELDS_TO_OMIT) };
          saveProcedureItem(procedureItem as FBProcedureItemConfig);
          return;
        }

        const omitFields = isEBProcedure ? EB_FIELDS_TO_OMIT : FIELDS_TO_OMIT;
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
        parentPartId: scanSelectedPartInfo.current?.title,
      };
    });

    if (isEBProcedure) {
      const newSubItems = scanLots.map((lot) => ({
        ...lot,
        id: FB.uniqid,
      }));

      const parentItem = state.data[parentIndex];

      const updatedSubItems = [...newSubItems, ...(parentItem[SUB_ITEMS_FIELD] ?? [])].map((item) =>
        omit(item, [...EB_FIELDS_TO_OMIT, 'title']),
      );

      state.data[parentIndex][SUB_ITEMS_FIELD] = updatedSubItems;
      const payload = omit(parentItem, EB_FIELDS_TO_OMIT) as FBProcedureItemConfig;

      const allSteps = workspaceState?.schema?.filter((step) => step.type === 'mpiprocedure');
      procedureState?.addItem(payload, type, allSteps);
      mpiProcedureState?.addItem(payload, type, allSteps);
      return;
    }

    saveScannedLots?.(updatedLots);
  };

  const openQuickView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableMaterial) => {
    setSelectedDataItem(dataItem);
    quickViewDialog.open();
    event.preventDefault();
    event.stopPropagation();
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableMaterial;
    const isEditMode = (item[MODE_FIELD] || item[ADD_FIELD]);
    const { isInsufficientQty } = (!isEditMode && !isEmpty(item[SUB_ITEMS_FIELD])) ? isPartHasInsufficientQty(item, lhrsQuantity) : { isInsufficientQty: false };

    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''), {
        [classes.whiteBg]: isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.grayBg]: !isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.errorBg]: (!isEmpty(item.type) && isLHRStep && isDesign) || (isInsufficientQty && !isEBProcedure),
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

    return <FormikProvider value={formik}>{editedRow}</FormikProvider>;
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
        title: '',
        lotId: selected.lotId,
        lotDocId: selected.lotDocId,
        parentPartId: selected.materialId,
        parentId: index !== -1 ? state.data[index].id : '',
        unit: selected.unit,
        quantity: selected.quantity,
        [MODE_FIELD]: false,
      };
      acc[materialId].push(lotItem);
      return acc;
    }, {});

    Object.keys(mapByMaterialId)?.map((materialId) => {
      const index = items?.findIndex((item) => {
        return item.title === materialId;
      });

      if (index !== -1) {
        state.data[index][SUB_ITEMS_FIELD] = mapByMaterialId[materialId];

        updateState({
          ...state,
          data: [...state.data],
          expanded: [state.data[index].id],
        });
      }
    });
  }, [partsSelected]);

  const scanDialog = useDialog();
  const scanSelectedPartInfo = useRef<ScanSelectedPartItem>();

  const openScanDialog = (dataItem: EditableMaterial) => {
    const plannedIdInfo = materialSelectOptions?.find((option) => option.value === dataItem.title);
    const match = /^(.+?) Rev (.+?) - (.+)$/.exec(plannedIdInfo?.label ?? '') ?? ['', '', ''];

    scanSelectedPartInfo.current = {
      docId: match[1] ?? '',
      partDescription: match[3],
      unit: dataItem.unit,
      quantityNeeded: dataItem.quantity,
      displayRevision: match[2],
      variance: '',
      partRevId: plannedIdInfo?.value,
      id: dataItem.id,
      title: dataItem?.title,
      type: FBProcedureItemType.materials,
      existingLotIds: dataItem?.[SUB_ITEMS_FIELD]?.map((data) => get(data, 'lotId')),
    };
    scanDialog.open();
  };

  const getSchemaBuilder = () => {
    if (isMPIProcedure && !isLHRStep) return buildMPISchema;
    if (isLHRStep) return buildLHRTSchema;
    if (isEBProcedure) return buildEBSchema;
    return buildSchema;
  };

  const { formState } = FB.useStores();
  const [lhrsQuantity, setLhrsQuantity] = useState(1);
  const { appendItemToStateData, removeScanLot, addPartItem, editPartItem, discardScanLot, addLot }
    = useMaterialActions(
      state,
      setState,
      formik,
      {
        isEnableOnlyLotAddition,
        isEBProcedure,
        isDesign,
        isPreview,
        isLHRStep,
        isMPIProcedure,
        isDisabled,
        type,
        isActive,
        isPendingChange,
        isRedlineActive,
      },
      {
        handleSelectionDelete,
        handleRemove,
        procedureState,
      },
    );

  const schema = getSchemaBuilder()({
    materialSelectOptions,
    actionsClass: classes.actionsCell,
    popperHolder: classes.popperHolder,
    onDiscard: discardScanLot,
    onDelete: removeScanLot,
    addLot: addLot,
    isLHRT: isLHRStep && isMPIProcedure,
    onConfirm: formik.submitForm,
    isLHRProductionBuild,
    onScanClick: openScanDialog,
    onRowClick: editPartItem,
  });

  React.useEffect(() => {
    const formValue = cloneDeep(formState?.getFieldValue(LHRS_START_QUANTITY_NAME));
    const acceptedQuantity = cloneDeep(formState?.getFieldValue(LHRS_ACCEPTED_QUANTITY));
    if (!isNil(formValue) || !isNil(acceptedQuantity)) {
      setLhrsQuantity(acceptedQuantity > 0 ? acceptedQuantity : formValue);
    }

    const dispose = reaction(
      () => ({
        start: formState?.getInputState(LHRS_START_QUANTITY_NAME)?.value,
        accepted: formState?.getInputState(LHRS_ACCEPTED_QUANTITY)?.value,
      }), ({ start, accepted }) => {
        if (!isNil(start) || !isNil(accepted)) {
          setLhrsQuantity(accepted > 0 ? accepted : start);
        }
      },
    );

    return () => dispose();
  }, [formState]);

  const [columns] = React.useState<CustomTreeListColumnProps[]>(schema);

  return (
    <Box className={classes.root} data-cy="material-grid">
      <MaterialTreelistContext.Provider
        value={{
          lhrsQuantity,
          addLot,
          openQuickView,
          isRedlineActive,
          isDisabled: isEBProcedure ? isDisabled : isDesign || !isEnableOnlyLotAddition,
          isEBProcedure,
        }}
      >
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
              resizable
            />
            {isActive && !isDisabled && !isLHRStep && (isDesign || !isEnableOnlyLotAddition) && (
              <Button kind="add" fullWidth attached onClick={addPartItem} data-cy="add-material">
                {translate('form.builder.procedure.material.table.add.part')}
              </Button>
            )}
            <DocumentRevisionDialog
              dialog={quickViewDialog}
              {...{
                docRevId: selectedDataItem?.lotId,
                parentRevId: selectedDataItem?.parentPartId,
              }}
            />
          </Grid>
        </FormikProvider>
      </MaterialTreelistContext.Provider>
      {scanDialog.isOpen && (
        <ScanCaptureDialog
          handler={scanDialog}
          isLHRScan
          onClose={scanDialog.close}
          addScanLotsToPart={addScanLotsToPart}
          selectedPart={scanSelectedPartInfo.current as ScanSelectedPartItem}
          parentRevId={workspaceState?.document?.id}
        />
      )}
    </Box>
  );
};

export default memo(withThemeNext(React.forwardRef(withMaterialsTable(MaterialsTable))));
