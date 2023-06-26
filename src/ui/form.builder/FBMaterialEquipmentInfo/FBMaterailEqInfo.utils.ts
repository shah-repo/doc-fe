import { find, isEqual, keys, omit, union, unionWith } from 'lodash';
import { FBMEQItemStatus, GenericItem, MaterialAndEquipment } from './FBMaterailEqInfo.types';

const getItemStatus = (
  childItem?: GenericItem,
  parentItem?: GenericItem,
): FBMEQItemStatus => {
  if (isEqual(childItem, parentItem)) {
    return FBMEQItemStatus.None;
  }
  if (childItem && parentItem) {
    return FBMEQItemStatus.Updated;
  }
  if (childItem) {
    return FBMEQItemStatus.Added;
  }
  return FBMEQItemStatus.Removed;
};

const normalizeItem = (item: GenericItem) => omit(item, ['quantity', 'unit']);

const calculateSectionDiff = <K extends (GenericItem)[]>(childItems: K, parentItems: K): K => {
  const allItems = unionWith(
    childItems,
    parentItems,
    (value, other) => isEqual(normalizeItem(value), normalizeItem(other)),
  );

  return allItems.map((item) => {
    const childItem = find(childItems, normalizeItem(item));
    const parentItem = find(parentItems, normalizeItem(item));

    return {
      ...item,
      status: getItemStatus(childItem, parentItem),
    };
  }) as K;
};

export const calculateDataDiff = <T extends MaterialAndEquipment | undefined>(child: T, parent: T): T => {
  if (!child || !parent) {
    return child;
  }
  const allKeys = union(keys(child), keys(parent));

  return allKeys.reduce((acc, key) => ({
    ...acc,
    [key]: calculateSectionDiff(child[key], parent[key]),
  }), {}) as T;
};
