import { isNil, isNumber } from 'lodash';
import { FBProcedureItemConfig } from '../../../FBProcedureItem/FBProcedureItem.types';
import { EditableEquipmentItem, EquipmentItem } from '../../interface';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD } from './constants';

export const isAddEquipItem = (dataItem: EditableEquipmentItem): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditEquipItem = (dataItem: EditableEquipmentItem): boolean => {
  return (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const getCellValue = (dataItem: EditableEquipmentItem, field?: string): string => {
  return ((field && dataItem[field]) ?? CELL_EMPTY_VALUE) as string;
};

export const getParsedFieldValue = (field) => {
  if (field === '' || isNil(field)) {
    return 0;
  }
  return isNumber(field) ? field ?? 0 : parseInt(field) ?? 0;
};

export const prepareData = (items: FBProcedureItemConfig[]): EquipmentItem[] => {
  return items.map(item => ({
    id: item?.id,
    plannedId: item?.title,
    actualId: '',
    calDueDate: '',
    pmDueDate: '',
    actualItems: [],
  }));
};
