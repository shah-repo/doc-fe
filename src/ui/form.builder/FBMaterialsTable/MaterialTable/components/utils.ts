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

export const isPartHasInsufficientQty = (dataItem: EditableMaterial, lhrsQuantity: number, acceptedQuantity: number): QuantityNeededCheck => {
  const subItems = dataItem?.[SUB_ITEMS_FIELD] ?? [];
  const quantityNeeded = dataItem?.quantity ? Number(toFixed(dataItem?.quantity, MAX_DECIMALS)) * lhrsQuantity : 0;
  const acceptedQuantityNeeded = dataItem?.quantity && acceptedQuantity ? Number(toFixed(dataItem?.quantity, MAX_DECIMALS)) * acceptedQuantity : 0;

  if (subItems.length === 1 && subItems[0]?.isNew) {
    return {
      isInsufficientQty: false,
      totalAssignedQty: subItems[0]?.quantity ?? 0,
      quantityNeeded,
    };
  }

  const totalAssignedQty = subItems.reduce((sum, lot) => sum + (lot.quantity ?? 0), 0);
  if (acceptedQuantity) {
    return { isInsufficientQty: !(totalAssignedQty <= quantityNeeded && totalAssignedQty >= acceptedQuantityNeeded), totalAssignedQty, quantityNeeded };
  } else {
    return { isInsufficientQty: totalAssignedQty !== quantityNeeded, totalAssignedQty, quantityNeeded };
  }
};

interface MaterialInsufficientQtyResult {
  hasInsufficientQty: boolean
  insufficientMaterials: string[]
  neededByMaterial?: Record<string, number>
  usedByMaterial?: Record<string, number>
}

export const isMpiOutputInsufficientQty = (
  neededQuantity?: NeededMaterial[][],
  usedQuantity?: UsedMaterial[],
  startQuantity?: number,
): MaterialInsufficientQtyResult => {
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

  const insufficientMaterials = Object.keys(neededByMaterial).filter((materialId) => {
    return (usedByMaterial[materialId] ?? 0) !== neededByMaterial[materialId];
  });

  return {
    hasInsufficientQty: insufficientMaterials.length > 0,
    insufficientMaterials,
    neededByMaterial,
    usedByMaterial,
  };
};

interface EquipmentSelectionResult {
  isSelected: boolean
  unselectedEquipment: string[]
}

export function areRequiredEquipmentsSelected (
  equipmentsFromSchema: SchemaEquipment[][],
  equipmentsFromMetadata: EquipmentMetadata[],
): EquipmentSelectionResult {
  if (!equipmentsFromSchema.length) {
    return { isSelected: true, unselectedEquipment: [] };
  }

  const requiredEquipmentIds = equipmentsFromSchema
    .flat()
    .map((equipment) => equipment?.title)
    .filter((id): id is string => Boolean(id));

  if (!requiredEquipmentIds.length) {
    return { isSelected: true, unselectedEquipment: [] };
  }

  const selectedEquipmentIds = new Set(
    equipmentsFromMetadata.map((item) => item?.equipmentId).filter(Boolean),
  );

  const unselectedEquipment = requiredEquipmentIds.filter((id) => !selectedEquipmentIds.has(id));

  return {
    isSelected: unselectedEquipment.length === 0,
    unselectedEquipment,
  };
}
