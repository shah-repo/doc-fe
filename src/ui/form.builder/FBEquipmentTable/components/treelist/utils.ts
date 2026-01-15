import { FBMPIProcedureSelectValue } from '../../../FBMPIProcedureSelect/FBMPIProcedureSelect.types';
import { FBProcedureItemConfig } from '../../../FBProcedureItem/FBProcedureItem.types';
import { EditableEquipmentItem, EquipmentItem } from '../../types';
import { ADD_FIELD, EB_SUB_ITEMS_FIELD, MODE_FIELD } from './constants';
import { MapSelectedByParentEquipId } from './types';

export const isAddEquipItem = (dataItem: EditableEquipmentItem): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditEquipItem = (dataItem: EditableEquipmentItem): boolean => {
  return (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const getMapSelectedByParentEquipId = (equipsSelected: Array<Partial<FBMPIProcedureSelectValue>>, items: FBProcedureItemConfig[]): MapSelectedByParentEquipId => {
  return equipsSelected?.reduce<MapSelectedByParentEquipId>((acc, selected) => {
    const equipmentId = selected?.equipmentId ?? '';
    if (!acc[equipmentId]) {
      acc[equipmentId] = [];
    }
    const index = items?.findIndex((item) => {
      return item.title === selected.equipmentId;
    });

    const actualEquipItem = {
      id: selected.refId,
      plannedId: '',
      actualId: selected.actualId,
      actualEquipDocId: selected.overrideDocId,
      parentEquipPlannedId: selected.equipmentId,
      parentId: index !== -1 ? items[index].id : '',
      pmDueDate: selected.pmDueDate,
      calDueDate: selected.calDueDate,
      eqStatus: selected.eqStatus,
      [MODE_FIELD]: false,
    };
    acc[equipmentId].push(actualEquipItem);
    return acc;
  }, {});
};

export const prepareData = (items: FBProcedureItemConfig[], isEBProcedure?: boolean): EquipmentItem[] => {
  if (isEBProcedure) {
    return items.map(item => ({
      ...item,
      id: item?.id,
      plannedId: item?.title,
      calDueDate: '',
      pmDueDate: '',
      [EB_SUB_ITEMS_FIELD]: item[EB_SUB_ITEMS_FIELD]?.map((ebInfo) => {
        return {
          ...ebInfo,
          parentId: item?.id,
          parentEquipPlannedId: item?.title,
        };
      }) ?? [],
    }));
  }

  return items.map(item => ({
    ...item,
    id: item?.id,
    plannedId: item?.title,
    actualId: '',
    calDueDate: '',
    pmDueDate: '',
    actualItems: [],
  }));
};

export const isDateOverdue = (date?: string) => {
  if (!date) {
    return;
  }

  return Date.parse(date) < Date.now();
};

export const getValidDueDate = (date?: string): string => {
  return date && date !== 'N/A' ? date : '-';
};

export const isEquipmentSpecificationType = (equipmentOptions, id: string): boolean => {
  const selectedEquipInfo = equipmentOptions?.find(
    (option) => option.value === id,
  );
  if (selectedEquipInfo?.label.startsWith('ES-')) {
    return true;
  }
  return false;
};
