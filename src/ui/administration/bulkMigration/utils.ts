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
