/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { some } from 'lodash';
import Colors from '../../layout/theme/utils/colors';
import { IMappedFrom, IRowData, ISchemaItem } from './interface';

export function canMapItems (selectedSchema: ISchemaItem, toSchemaItem: ISchemaItem): {canMap: boolean, errMessage: string} {
  let canMap = true;
  let errMessage = '';
  // Rule 1 - Autocomplete type / Checkbox Group must be mapped to an autocomplete / Checkbox Group, an object, or an array type.
  const types = ['autocomplete', 'checkboxgroup'];
  for (const type of types) {
    if (selectedSchema.type === type) {
      if (toSchemaItem.type !== type && !toSchemaItem.referenceDataType) {
        canMap = false;
        errMessage = `${type} can be mapped to an ${type}, an object, or an array type`;
      }
    }
  }

  return { canMap, errMessage };
}

export function validateTableMappings (selectedRow: IRowData): {canMap: boolean, errMessage: string} {
  let canMap = true;
  let errMessage = '';

  // Rule 2:3 - In a table row, only one column can be an autocomplete / checkboxGroup
  let columnKeyWithAutocomplete;
  let columnKeyWithCheckbox;

  for (const key of Object.keys(selectedRow)) {
    if (key === 'id') {
      continue;
    }

    const mappedEntries: IMappedFrom[] = selectedRow[key] ?? [];

    if (mappedEntries.length) {
      const hasAutocomplete = some(mappedEntries, { type: 'autocomplete' });
      const hasNonAutocomplete = some(mappedEntries, (item) => item.type !== 'autocomplete');

      // Within the same column cannot map autocomplete and non autocomplete fields.
      if (hasAutocomplete && hasNonAutocomplete) {
        canMap = false;
        errMessage = 'Within the same column cannot map autocomplete and non autocomplete fields';
      }

      const hasCheckboxgroup = some(mappedEntries, { type: 'checkboxgroup' });
      const hasNonCheckboxgroup = some(mappedEntries, (item) => item.type !== 'checkboxgroup');

      // Within the same column cannot map checkboxgroup and non checkboxgroup fields.
      if (hasCheckboxgroup && hasNonCheckboxgroup) {
        canMap = false;
        errMessage = 'Within the same column cannot map checkboxgroup and non checkboxgroup fields';
      }

      if (hasAutocomplete) {
        if (!columnKeyWithAutocomplete || columnKeyWithAutocomplete === key) {
          columnKeyWithAutocomplete = key;
        } else {
          canMap = false;
          errMessage = `In this table row, ${columnKeyWithAutocomplete} is already an autocomplete. Only one column can be an autocomplete`;
        }
      }

      if (hasCheckboxgroup) {
        if (!columnKeyWithCheckbox || columnKeyWithCheckbox === key) {
          columnKeyWithCheckbox = key;
        } else {
          canMap = false;
          errMessage = `In this table row, ${columnKeyWithCheckbox} is already an checkboxgroup. Only one column can be an checkboxgroup`;
        }
      }
    }
  }
  return { canMap, errMessage };
}

export function getFromSchemaItemBgColor (schemaItem: ISchemaItem): string {
  if (isDisabledSchemaItem(schemaItem)) {
    return Colors.hint_gray;
  } else if (schemaItem.mappedToCount) {
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
  const toRevSchemaIndex: {[key: string]: ISchemaItem[]} = {};
  toRevSchema.forEach(item => {
    if (!isDisabledSchemaItem(item)) {
      if (item.name) toRevSchemaIndex[item.name] = [item];
      if (item.label && typeof item.label === 'string') {
        if (toRevSchemaIndex[item.label.toLocaleLowerCase()]?.length) {
          toRevSchemaIndex[item.label.toLocaleLowerCase()].push(item);
        } else {
          toRevSchemaIndex[item.label.toLocaleLowerCase()] = [item];
        }
      }
    }
  });

  console.log(toRevSchemaIndex);

  // Iterate through fromRevSchema and update isMapped and mappedFrom
  for (const fromRevSchemaItem of fromRevSchema) {
    if (isDisabledSchemaItem(fromRevSchemaItem)) {
      continue;
    }

    let matchingItemsFromName: ISchemaItem[] = [];
    if (fromRevSchemaItem.name && typeof fromRevSchemaItem.name === 'string') {
      matchingItemsFromName = toRevSchemaIndex[fromRevSchemaItem.name];
    }

    let matchingItemsFromLabel: ISchemaItem[] = [];
    if (fromRevSchemaItem.label && typeof fromRevSchemaItem.label === 'string') {
      matchingItemsFromLabel = toRevSchemaIndex[fromRevSchemaItem.label.toLocaleLowerCase()];
    }

    const matchingItems: ISchemaItem[] = matchingItemsFromLabel ?? matchingItemsFromName;

    for (const matchingItem of matchingItems) {
      if (matchingItem?.name) {
        fromRevSchemaItem.mappedToCount = (fromRevSchemaItem.mappedToCount ?? 0) + 1;
        if (!matchingItem.mappedFrom) {
          matchingItem.mappedFrom = [];
        }

        // If item already exists - do not add it again
        if (matchingItem.mappedFrom.findIndex(entry => entry.name === fromRevSchemaItem.name) === -1) {
          matchingItem.mappedFrom.push(
            { name: fromRevSchemaItem.name!, label: fromRevSchemaItem.label, isShowDirectly: true, type: fromRevSchemaItem.type });
        }

        // But if the fromRev matches the name of the toRev only keep that
        const matchingNameEntry = matchingItem.mappedFrom.find(mappedFromItem => mappedFromItem.name === matchingItem.name);
        if (matchingNameEntry) {
          matchingItem.mappedFrom = [matchingNameEntry];
        }
      }
    }
  }

  return { fromRevSchema, toRevSchema };
}
