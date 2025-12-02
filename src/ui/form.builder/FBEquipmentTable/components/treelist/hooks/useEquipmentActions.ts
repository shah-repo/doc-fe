import { FilterDescriptor } from '@progress/kendo-data-query';
import { extendDataItem, filterBy, mapTree, orderBy } from '@progress/kendo-react-treelist';
import { isNil, keyBy, uniq } from 'lodash';
import { FB } from '../../../../helpers';
import { EditableEquipmentItem, EquipmentItem, EquipmentItemEditEvent } from '../../../types';
import { ADD_FIELD, EB_SUB_ITEMS_FIELD, EXPAND_FIELD, MODE_FIELD, SUB_ITEMS_FIELD } from '../constants';
import { CustomTreeListExpandChangeEvent } from '../types';

export function useEquipmentActions (state, setState, formik, flags, externalHandlers) {
  const {
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
  } = flags;

  const { handleSelectionDelete, handleRemove, procedureState, workspaceState, lhrStepState } = externalHandlers;

  const subItemsKey = isEBProcedure ? EB_SUB_ITEMS_FIELD : SUB_ITEMS_FIELD;

  const updateLHRTEquipmentItem = (item: Partial<EditableEquipmentItem>) => {
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
            newData[parentIndex][subItemsKey] = newData[parentIndex][subItemsKey]?.filter((data) =>
              dataItem.id ? dataItem.id !== data.id : !data[ADD_FIELD],
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

  const deleteItemFromStateData = (dataItem: EditableEquipmentItem) => {
    if (isEnableActualIdAddition) {
      const parentIndex = state.data?.findIndex((data) => data.id === dataItem.parentId);
      if (parentIndex !== -1) {
        state.data[parentIndex][subItemsKey] = state.data[parentIndex][subItemsKey]?.filter((item) => item.id !== dataItem.id);
      } else if (dataItem.id && isEBProcedure) {
        state.data = state.data.filter((item) => item.id !== dataItem.id);
      }
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

      setState((prevState) => ({
        ...prevState,
        data: [...state.data],
        expanded: [state.data[index].id],
        inEdit: [newActualItem],
      }));
    }
  };

  const onExpandChange = (event: CustomTreeListExpandChangeEvent) => {
    const expanded = event.value
      ? state.expanded.filter((id) => id !== event.dataItem.id)
      : uniq([...state.expanded, event.dataItem.id]);

    setState((prevState) => ({
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
    const filteredData = dataState.filter && filterBy(data, filter, subItemsKey);
    const sortedData = dataState.sort && filteredData && orderBy(filteredData, dataState?.sort, subItemsKey);

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
      setState((prevState) => ({
        ...prevState,
        data: [...state.data],
        inEdit: [newEquipItem],
      }));
      formik.setValues(newEquipItem);
    }
  };

  const editEquipmentItem = ({ dataItem, level }: EquipmentItemEditEvent) => {
    const defaultValidation
      = (isEnableActualIdAddition && dataItem.plannedId && (!isPreview || isDisabled))
      || (!isEnableActualIdAddition && isPreview);
    const isEditRestricted
      = dataItem[MODE_FIELD]
      || (isLHRStep && isDesign
        ? !((isPreview || isPendingChange) && (dataItem.type || dataItem.paramsId))
        : defaultValidation);

    if ((isEditRestricted && !isEBProcedure) || (isEBProcedure && isDisabled)) {
      return;
    }

    if (isMPIProcedure && !isLHRStep && isDisabled && !isPreview) {
      return;
    }

    if (isLHRStep && isDesign && !dataItem.paramsId) {
      dataItem.paramsId = dataItem?.id;
    }

    const editItemInfo = extendDataItem(dataItem, subItemsKey);

    if (isMPIProcedure || isLHRStep || isEBProcedure) {
      const index = state?.data?.findIndex((data) => {
        return data.id === dataItem.id;
      });
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

  return {
    discardEquipItem,
    editEquipmentItem,
    addEquipItem,
    onExpandChange,
    addActualId,
    removeEquipItem,
    processData,
    updateLHRTEquipmentItem,
  };
}
