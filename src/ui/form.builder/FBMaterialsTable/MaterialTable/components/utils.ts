import { toFixed } from '../../../../dashboard.new/line.items/common/Utils';
import { FBProcedureItemConfig } from '../../../FBProcedureItem/FBProcedureItem.types';
import { ADD_FIELD, MAX_DECIMALS, MODE_FIELD, SUB_ITEMS_FIELD } from '../constants';
import { EditableMaterial, Material } from '../types';

interface SchemaEquipment {
  title?: string
}

interface EquipmentMetadata {
  equipmentId?: string
}

interface NeededMaterial {
  materialId?: string
  quantity?: number
  title?: string
}

interface UsedMaterial {
  materialId?: string
  quantity?: number
}

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

export const isMpiOutputInsufficientQty = (
  neededQuantity?: NeededMaterial[][],
  usedQuantity?: UsedMaterial[],
  startQuantity?: number,
): boolean => {
  const flatNeeded: NeededMaterial[] = (neededQuantity ?? []).flat();

  const neededByMaterial = flatNeeded.reduce<Record<string, number>>(
    (acc, item) => {
      const key = item?.title;
      if (!key || item.quantity == null) {
        return acc;
      }
      acc[key] = (acc[key] ?? 0) + (item?.quantity ?? 0) * (startQuantity ?? 0);
      return acc;
    },
    {},
  );

  const usedByMaterial = (usedQuantity ?? []).reduce<Record<string, number>>(
    (acc, item) => {
      const key = item?.materialId;
      if (!key || item.quantity == null) {
        return acc;
      }
      acc[key] = (acc[key] ?? 0) + (item?.quantity ?? 0);
      return acc;
    },
    {},
  );

  return Object.keys(neededByMaterial).some((materialId) => {
    return (usedByMaterial[materialId] ?? 0) !== neededByMaterial[materialId];
  });
};

export function areRequiredEquipmentsSelected (
  equipmentsFromSchema: SchemaEquipment[][],
  equipmentsFromMetadata: EquipmentMetadata[],
): boolean {
  if (!equipmentsFromSchema.length) {
    return true;
  }

  const requiredEquipmentIds = equipmentsFromSchema
    .flat()
    .map((equipment) => equipment?.title)
    .filter(Boolean);

  if (!requiredEquipmentIds.length) {
    return true;
  }

  const selectedEquipmentIds = new Set(
    equipmentsFromMetadata.map((item) => item?.equipmentId).filter(Boolean),
  );

  return requiredEquipmentIds.every((id) => selectedEquipmentIds.has(id));
}
