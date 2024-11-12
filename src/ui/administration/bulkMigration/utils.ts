/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FBSchemaProps } from '../../form.builder';
import Colors from '../../layout/theme/utils/colors';
import { ISchemaItem } from './interface';

export function canMapItems (selectedSchema: FBSchemaProps, toSchemaItem: FBSchemaProps) {
  return true;
}

export function getFromSchemaItemBgColor (schemaItem: ISchemaItem): string {
  if (isDisabledSchemaItem(schemaItem)) {
    return Colors.hint_gray;
  } else if (schemaItem.isMapped) {
    return Colors.snow_flurry;
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
      if (item.label) toRevSchemaIndex[item.label.toString()] = item;
    }
  });

  // Iterate through fromRevSchema and update isMapped and mappedFrom
  fromRevSchema.forEach(fromRevSchemaItem => {
    let matchingItem: ISchemaItem = {};
    if (fromRevSchemaItem.name && typeof fromRevSchemaItem.name === 'string') {
      matchingItem = toRevSchemaIndex[fromRevSchemaItem.name];
    } else if (fromRevSchemaItem.label && typeof fromRevSchemaItem.label === 'string') {
      matchingItem = toRevSchemaIndex[fromRevSchemaItem.label];
    }

    if (matchingItem?.name) {
      fromRevSchemaItem.isMapped = true;
      if (!matchingItem.mappedFrom) {
        matchingItem.mappedFrom = [];
      }

      // If item already exists - do not add it again
      if (matchingItem.mappedFrom.findIndex(entry => entry.name === fromRevSchemaItem.name) === -1) {
        matchingItem.mappedFrom.push({ name: fromRevSchemaItem.name!, label: fromRevSchemaItem.label });
      }
    }
  });

  return { fromRevSchema, toRevSchema };
}
