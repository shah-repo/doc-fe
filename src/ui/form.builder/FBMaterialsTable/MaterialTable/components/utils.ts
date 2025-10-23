import { translate } from '../../../../../common/intl';
import { FBProcedureItemConfig } from '../../../FBProcedureItem/FBProcedureItem.types';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD } from '../constants';
import { EditableMaterial, Material } from '../types';

export const isAddMaterial = (dataItem: EditableMaterial): boolean => {
  return dataItem[ADD_FIELD] ?? false;
};

export const isEditMaterial = (dataItem: EditableMaterial): boolean => {
  return Boolean(dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) ?? false;
};

export const getCellValue = (dataItem: EditableMaterial, field?: string): string => {
  return ((field && dataItem[field]) ?? CELL_EMPTY_VALUE) as string;
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
    plannedId: item.title,
    isLotAdditionIconsShown: true,
    assignedLots: item.assignedLots?.map(lot => ({
      ...lot,
      parentPartPlannedId: isEBProcedure ? item.title : item.plannedId,
      parentId: item.id,
    })),
  }));
};

export const checkQuantityMismatchWithTooltip = (item): { isMismatch: boolean, tooltip: string | null } => {
  const totalAssignedQuantity = item.assignedLots?.reduce((sum, lot) => sum + lot.quantity, 0) ?? 0;
  const isMismatch = item.quantity > totalAssignedQuantity;
  const tooltip = isMismatch
    ? translate('form.builder.procedure.material.lot.quantity.error.message', {
      lotAssignedQuantity: totalAssignedQuantity,
      quantity: item.quantity,
    })
    : null;

  return { isMismatch, tooltip };
};
