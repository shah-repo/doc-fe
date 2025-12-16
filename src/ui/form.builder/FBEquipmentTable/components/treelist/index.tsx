import { Grid } from '@material-ui/core';
import { TreeList, TreeListCellProps } from '@progress/kendo-react-treelist';
import { ScrollMode } from '@progress/kendo-react-treelist/dist/npm/ScrollMode';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import {
  cloneDeep,
  concat,
  isEmpty,
  omit,
  replace,
} from 'lodash';
import { useObserver } from 'mobx-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import { companySelectors } from '../../../../../state/ducks/company';
import ScanCaptureDialog from '../../../../components/common/dialogs/scaner';
import { ScanSelectedPartItem } from '../../../../components/common/dialogs/scaner/components/lot.table/types';
import { CustomTreeListColumnProps } from '../../../../components/common/treelist/types';
import { Button as AddButton } from '../../../../components/forms/fields-next';
import useDialog from '../../../../hooks/useDialog';
import { withThemeNext } from '../../../../layout/theme-next';
import { FBProcedureItemConfig, FBProcedureItemType } from '../../../FBProcedureItem/FBProcedureItem.types';
import { FB } from '../../../helpers';
import { EditableEquipmentItem } from '../../types';
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
import { useEquipmentActions } from './hooks/useEquipmentActions';
import { useFetchData } from './hooks/useFetchData';
import { TreeListEBSchema } from './schemas/ebSchema';
import { TreeListLHRTSchema } from './schemas/lhrtSchema';
import { TreeListMPISchema } from './schemas/mpiSchema';
import { TreeListSchema } from './schemas/schema';
import useStyles from './styles';
import {
  CustomTreeListRowProps,
  EquipmentItemState,
  FBEquipmentProps,
} from './types';
import { getMapSelectedByParentEquipId, prepareData } from './utils';
import { withFBEquipmentTable } from './wrap';

interface EquipmentTreelistContextProps {
  isRedlineActive?: boolean
  isEnableActualIdAddition?: boolean
  isEqProdConfigEnforced?: boolean
  isLHRProductionBuild?: boolean
}

export const EquipmentTreelistContext = React.createContext<EquipmentTreelistContextProps>({
  isRedlineActive: false,
  isEnableActualIdAddition: false,
});

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
  const isLHRProductionBuild = workspaceState?.isLHRProductionBuild || false;
  const subItemsKey = isEBProcedure ? EB_SUB_ITEMS_FIELD : SUB_ITEMS_FIELD;
  const scanSelectedEquipInfo = useRef<ScanSelectedPartItem>();
  const size = useObserver(() => _tabsState?.contentSize);
  const classes = useStyles({ size });
  const { equipmentOptions } = useFetchData();
  const isRedlineActive = useSelector(companySelectors.getRedlineActive);

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
      let isEquipmentSpecification = false;
      if (isEnableActualIdAddition && !isEBProcedure) {
        if (values[ADD_FIELD]) {
          saveActualEquipment?.(values as EditableEquipmentItem);
        }
        discardEquipItem(values as EditableEquipmentItem);
        return;
      }

      if (isMPIProcedure) {
        const selectedEquipInfo = equipmentOptions?.find((option) => option.value === values.title);
        if (selectedEquipInfo?.label.startsWith('ES-')) {
          isEquipmentSpecification = true;
        }
      }

      const { id = '', plannedId = '', title = '', LHRTparameter } = values;
      let newEquipItem: EditableEquipmentItem = {
        id,
        title: isDesign ? title : plannedId,
        type: values.type,
      };

      if (!isEBProcedure) {
        newEquipItem.isEquipmentSpecification = isEquipmentSpecification;
      }

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

  const {
    discardEquipItem,
    editEquipmentItem,
    addEquipItem,
    onExpandChange,
    addActualId,
    removeEquipItem,
    processData,
    updateLHRTEquipmentItem,
    isEqProdConfigEnforced,
  } = useEquipmentActions(
    state,
    setState,
    formik,
    {
      isEnableActualIdAddition,
      isEBProcedure,
      isDesign,
      isPreview,
      isLHRStep,
      isMPIProcedure,
      isDisabled,
      type,
      isPendingChange,
      lhrStepIndex,
      isRedlineActive,
    },
    {
      handleSelectionDelete,
      handleRemove,
      procedureState,
      workspaceState,
      lhrStepState,
    },
  );

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
        <EquipmentTreelistContext.Provider value={{ isRedlineActive, isEnableActualIdAddition, isLHRProductionBuild, isEqProdConfigEnforced }}>
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
        </EquipmentTreelistContext.Provider>
      </Grid>
      <Grid item>
        {!isDisabled && (
          <AddButton
            fullWidth
            attached
            kind="add"
            className={classes.bottomAddButtom}
            data-cy="add-equipment"
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
