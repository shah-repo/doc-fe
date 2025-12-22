import { toFixed } from '../../../../dashboard.new/line.items/common/Utils';
import { FBProcedureItemConfig } from '../../../FBProcedureItem/FBProcedureItem.types';
import { ADD_FIELD, MAX_DECIMALS, MODE_FIELD, SUB_ITEMS_FIELD } from '../constants';
import { EditableMaterial, Material } from '../types';

export const isAddMaterial = (dataItem: EditableMaterial): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditMaterial = (dataItem: EditableMaterial): boolean => {
  return Boolean(dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const prepareData = (items?: FBProcedureItemConfig[], isDesign?: boolean, isEBProcedure?: boolean): Material[] => {
  if (!items) {
    return [];
  }

  if (isDesign) {
    return items;
  }

  return items.map(item => ({
    ...item,
    isLotAdditionIconsShown: true,
    assignedLots: item.assignedLots?.map(lot => ({
      ...lot,
      parentPartId: item.title,
      parentId: item.id,
    })),
  }));
};

interface QuantityNeededCheck {isInsufficientQty: boolean, totalAssignedQty: number, quantityNeeded: number}

export const isPartHasInsufficientQty = (dataItem: EditableMaterial, lhrsQuantity: number): QuantityNeededCheck => {
  const subItems = dataItem?.[SUB_ITEMS_FIELD] ?? [];
  const quantityNeeded = dataItem?.quantity ? Number(toFixed(dataItem?.quantity, MAX_DECIMALS)) * lhrsQuantity : 0;

  if (subItems.length === 1 && subItems[0]?.isNew) {
    return {
      isInsufficientQty: false,
      totalAssignedQty: subItems[0]?.quantity ?? 0,
      quantityNeeded,
    };
  }

  const totalAssignedQty = subItems.reduce((sum, lot) => sum + (lot.quantity ?? 0), 0);

  return { isInsufficientQty: totalAssignedQty !== quantityNeeded, totalAssignedQty, quantityNeeded };
};
