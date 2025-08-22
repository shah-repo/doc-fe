import { FBProcedureItemConfig } from '../../../FBProcedureItem/FBProcedureItem.types';
import { EditableEquipmentItem, EquipmentItem } from '../../interface';
import { ADD_FIELD, MODE_FIELD } from './constants';

export const isAddEquipItem = (dataItem: EditableEquipmentItem): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditEquipItem = (dataItem: EditableEquipmentItem): boolean => {
  return (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && (dataItem.actualId || dataItem?.isActualIdAddition);
};

export const prepareData = (items: FBProcedureItemConfig[]): EquipmentItem[] => {
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
