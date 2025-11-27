import { extendDataItem } from '@progress/kendo-react-treelist';
import { isNil } from 'lodash';
import { FB } from '../../../helpers';
import { ADD_FIELD, MODE_FIELD, SUB_ITEMS_FIELD } from '../constants';
import { EditableMaterial, Material, MaterialEditEvent } from '../types';

export function useMaterialActions (state, setState, formik, flags, externalHandlers) {
  const {
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
  } = flags;

  const { handleSelectionDelete, handleRemove, procedureState } = externalHandlers;

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

  const deleteItemFromStateData = (scanLot) => {
    if (isEnableOnlyLotAddition || scanLot?.parentId) {
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
    } else if (isEBProcedure && material.parentId) {
      procedureState?.removeEBChildrenItem(material.parentId ?? '', material.id, type, SUB_ITEMS_FIELD);
    } else {
      handleRemove?.(material.id);
    }
    deleteItemFromStateData(material);
  };

  const createPartItem = (): EditableMaterial => {
    return {
      id: FB.uniqid,
      title: '',
      ...(isMPIProcedure && !isLHRStep && { title: '' }),
      unit: '',
      quantity: undefined,
      isLotAddition: false,
      LHRTparameter: true,
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
    const defaultValidation
      = (isEnableOnlyLotAddition && dataItem.title && (!isActive || isDisabled))
      || (!isEnableOnlyLotAddition && isPreview);
    const isEditRestricted
      = dataItem[MODE_FIELD]
      || (isLHRStep && isDesign
        ? !((isActive || isPendingChange) && (dataItem.type || dataItem.paramsId))
        : defaultValidation);

    if ((isEditRestricted && !isEBProcedure) || (isEBProcedure && isDisabled)) {
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

  const updateState = (stateInfo) => {
    setState(stateInfo);
  };

  const createNewLotItem = () => {
    const baseItem = {
      id: FB.uniqid,
      unit: '',
      quantity: undefined,
      isLotAddition: true,
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
    };

    if (isEBProcedure) {
      return baseItem;
    }

    return {
      ...baseItem,
      title: '',
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

  const addLot = (dataItem: EditableMaterial) => {
    const index = state?.data?.findIndex((data) => {
      return data.id === dataItem.id;
    });
    state.data = ignorePreviouslyAddedItems(state.data);

    if (state.data.length && index !== -1) {
      const newAllocItem: EditableMaterial = createNewLotItem();
      newAllocItem.parentPartId = dataItem.title;
      newAllocItem.parentId = dataItem.id;
      newAllocItem.unit = dataItem.unit;
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
      formik.setValues(newAllocItem);
    }
  };

  const discardScanLot = (dataItem?: EditableMaterial) => {
    setState((prevState) => {
      const newData = [...prevState.data];

      if (dataItem?.[ADD_FIELD]) {
        if (dataItem.isLotAddition) {
          const parentIndex = newData.findIndex((data) => {
            return data.title === dataItem.parentPartId;
          });

          if (parentIndex !== -1) {
            newData[parentIndex][SUB_ITEMS_FIELD] = newData[parentIndex][SUB_ITEMS_FIELD]?.filter((data) =>
              dataItem.id ? dataItem.id !== data.id : !data[ADD_FIELD],
            );
          }
        } else {
          const filteredItems = newData.filter((data) => (dataItem.id ? dataItem.id !== data.id : !data[ADD_FIELD]));
          return {
            ...prevState,
            data: filteredItems,
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

  return {
    appendItemToStateData,
    removeScanLot,
    addPartItem,
    editPartItem,
    discardScanLot,
    addLot,
  };
}
