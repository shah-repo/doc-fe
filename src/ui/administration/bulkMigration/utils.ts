/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Colors from '../../layout/theme/utils/colors';
import { ISchemaItem } from './interface';

export function canMapItems (selectedSchema: ISchemaItem, toSchemaItem: ISchemaItem) {
  return true;
}

export function getFromSchemaItemBgColor (schemaItem: ISchemaItem): string {
  if (isDisabledSchemaItem(schemaItem)) {
    return Colors.hint_gray;
  } else if (schemaItem.isMapped) {
    return Colors.light_green_selected;
  } else {
    return Colors.seashell;
  }
}

export function isDisabledSchemaItem (schemaItem: ISchemaItem): boolean {
  return ['section', 'subsection'].includes(schemaItem.type ?? '');
}

export function autoMapArrays (
  fromRevSchema: ISchemaItem[], toRevSchema: ISchemaItem[]): {fromRevSchema: ISchemaItem[], toRevSchema: ISchemaItem[]} {
  // Index toRevSchema by name and label for fast lookup
  const toRevSchemaIndex = {};
  toRevSchema.forEach(item => {
    if (!isDisabledSchemaItem(item)) {
      if (item.name) toRevSchemaIndex[item.name] = item;
      if (item.label && typeof item.label === 'string') {
        toRevSchemaIndex[item.label.toLocaleLowerCase()] = item;
      }
    }
  });

  // Iterate through fromRevSchema and update isMapped and mappedFrom
  fromRevSchema.forEach(fromRevSchemaItem => {
    let matchingItemFromName: ISchemaItem = {};
    if (fromRevSchemaItem.name && typeof fromRevSchemaItem.name === 'string') {
      matchingItemFromName = toRevSchemaIndex[fromRevSchemaItem.name];
    }

    let matchingItemFromLabel: ISchemaItem = {};
    if (fromRevSchemaItem.label && typeof fromRevSchemaItem.label === 'string') {
      matchingItemFromLabel = toRevSchemaIndex[fromRevSchemaItem.label.toLocaleLowerCase()];
    }

    const matchingItem: ISchemaItem = matchingItemFromName ?? matchingItemFromLabel;

    if (matchingItem?.name) {
      fromRevSchemaItem.isMapped = true;
      if (!matchingItem.mappedFrom) {
        matchingItem.mappedFrom = [];
      }

      // If item already exists - do not add it again
      if (matchingItem.mappedFrom.findIndex(entry => entry.name === fromRevSchemaItem.name) === -1) {
        matchingItem.mappedFrom.push(
          { name: fromRevSchemaItem.name!, label: fromRevSchemaItem.label, isShowDirectly: true, type: fromRevSchemaItem.type });
      }
    }
  });

  return { fromRevSchema, toRevSchema };
}
