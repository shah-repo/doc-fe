/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { some } from 'lodash';
import { translate } from '../../../common/intl';
import { MigrationSpecialFields } from '../../documentRevision/forms/presenters/change.document.form/utils/constants';
import { checkSpecialFields } from '../../documentRevision/forms/presenters/change.document.form/utils/transform';
import Colors from '../../layout/theme/utils/colors';
import { FormFieldSchema, MismatchResponse, SourceMapping, TableRowData } from './interface';

const schemaValidationMap = {
  supplierContacts: {
    isPrimary: {
      isNotMappable: true,
    },
  },
  supplierSupportingDocs: {
    attachments: {
      shouldMapTo: 'fileupload',
    },
  },
};

const FROM_OPTIONS_TYPES: string[] = [MigrationSpecialFields.CHECKBOX_GROUP,
  MigrationSpecialFields.SELECT,
  MigrationSpecialFields.RADIO_GROUP,
];

const TO_OPTIONS_TYPES: string[] = [...FROM_OPTIONS_TYPES,
  MigrationSpecialFields.CHECKBOX_GROUP_ASYNC,
];

export function canMapItems (
  selectedSchemaItem: FormFieldSchema, toSchemaItem: FormFieldSchema,
): {canMap: boolean, errMessage?: string, showOptionsMapper?: boolean} {
  const errMessage = '';
  let canMap = true;

  if (!toSchemaItem.referenceDataType) {
    const selectedType = selectedSchemaItem.type as string;
    const targetType = toSchemaItem.type as string;

    const hasOptions = FROM_OPTIONS_TYPES.includes(selectedType) && TO_OPTIONS_TYPES.includes(targetType);
    if (selectedType !== targetType && !hasOptions) {
      return {
        canMap: false,
        errMessage: translate('bulk.migration.mapping.message', { selectedType }),
      };
    }

    canMap = checkSpecialFields(selectedSchemaItem, toSchemaItem);

    if (!canMap) {
      if (hasOptions) {
        return {
          canMap,
          showOptionsMapper: true,
        };
      }
      return {
        canMap,
        errMessage: translate('bulk.migration.mapping.with.options.message', { selectedType }),
      };
    }
  }

  return { canMap, errMessage };
}

export function validateTableMappings (
  key: string, selectedSchemaItem: FormFieldSchema, selectedRow: TableRowData, mappedToSchemaItem: FormFieldSchema,
): {canMap: boolean, errMessage: string} {
  const canMap = true;
  const errMessage = '';

  // Rule 2:3 - In a table row, only one column can be an autocomplete / checkboxGroup
  let columnKeyWithAutocomplete;
  let columnKeyWithCheckbox;

  for (const selectedRowKey of Object.keys(selectedRow)) {
    if (selectedRowKey === 'id') {
      continue;
    }

    const mappedEntries: SourceMapping[] = selectedRow[selectedRowKey] ?? [];

    if (mappedEntries.length) {
      const hasAutocomplete = some(mappedEntries, { type: 'autocomplete' });
      const hasNonAutocomplete = some(mappedEntries, (item) => item.type !== 'autocomplete');

      // Within the same column cannot map autocomplete and non autocomplete fields.
      if (hasAutocomplete && hasNonAutocomplete) {
        return {
          canMap: false,
          errMessage: translate('bulk.migration.mapping.same.column.field.error.message', { type: 'autocomplete' }),
        };
      }

      const hasCheckboxgroup = some(mappedEntries, { type: 'checkboxgroup' });
      const hasNonCheckboxgroup = some(mappedEntries, (item) => item.type !== 'checkboxgroup');

      // Within the same column cannot map checkboxgroup and non checkboxgroup fields.
      if (hasCheckboxgroup && hasNonCheckboxgroup) {
        return {
          canMap: false,
          errMessage: translate('bulk.migration.mapping.same.column.field.error.message', { type: 'checkboxgroup' }),
        };
      }

      if (hasAutocomplete) {
        if (!columnKeyWithAutocomplete || columnKeyWithAutocomplete === selectedRowKey) {
          columnKeyWithAutocomplete = selectedRowKey;
        } else {
          return {
            canMap: false,
            errMessage: translate('bulk.migration.mapping.same.row.field.error.message', { incomingType: columnKeyWithCheckbox, type: 'autocomplete' }),
          };
        }
      }

      if (hasCheckboxgroup) {
        if (!columnKeyWithCheckbox || columnKeyWithCheckbox === selectedRowKey) {
          columnKeyWithCheckbox = selectedRowKey;
        } else {
          return {
            canMap: false,
            errMessage: translate('bulk.migration.mapping.same.row.field.error.message', { incomingType: columnKeyWithCheckbox, type: 'checkboxgroup' }),
          };
        }
      }
    }
  }

  const keyAttributes = schemaValidationMap[mappedToSchemaItem.type!]?.[key];
  if (keyAttributes?.isNotMappable) {
    return {
      canMap: false,
      errMessage: translate('bulk.migration.mappable.error.message'),
    };
  }

  if (keyAttributes?.shouldMapTo && keyAttributes.shouldMapTo !== selectedSchemaItem.type) {
    return {
      canMap: false,
      errMessage: translate('bulk.migration.mappable.general.error.message', { shouldMapTo: keyAttributes.shouldMapTo }),
    };
  }

  return { canMap, errMessage };
}

export function getFromSchemaItemBgColor (schemaItem: FormFieldSchema): string {
  if (isDisabledSchemaItem(schemaItem)) {
    return Colors.hint_gray;
  } else if (schemaItem.mappedToCount) {
    return Colors.light_green_selected;
  } else {
    return Colors.seashell;
  }
}

export function isDisabledSchemaItem (schemaItem: FormFieldSchema): boolean {
  return ['section', 'subsection'].includes(schemaItem.type ?? '');
}

export function autoMapArrays (
  fromRevSchema: FormFieldSchema[], toRevSchema: FormFieldSchema[]): {fromRevSchema: FormFieldSchema[], toRevSchema: FormFieldSchema[]} {
  // Index toRevSchema by name and label for fast lookup
  const toRevSchemaIndex: {[key: string]: FormFieldSchema[]} = {};
  toRevSchema.forEach(item => {
    if (!isDisabledSchemaItem(item)) {
      if (item.name) toRevSchemaIndex[item.name] = [item];
      if (item.label && typeof item.label === 'string') {
        const lowercaseLabel = item.label.toLocaleLowerCase();
        if (toRevSchemaIndex[lowercaseLabel]?.length) {
          toRevSchemaIndex[lowercaseLabel].push(item);
        } else {
          toRevSchemaIndex[lowercaseLabel] = [item];
        }
      }
    }
  });

  // Iterate through fromRevSchema and update isMapped and mappedFrom
  for (const fromRevSchemaItem of fromRevSchema) {
    if (isDisabledSchemaItem(fromRevSchemaItem)) {
      continue;
    }

    let matchingItemsFromName: FormFieldSchema[] = [];
    if (fromRevSchemaItem.name && typeof fromRevSchemaItem.name === 'string') {
      matchingItemsFromName = toRevSchemaIndex[fromRevSchemaItem.name];
    }

    let matchingItemsFromLabel: FormFieldSchema[] = [];
    if (fromRevSchemaItem.label && typeof fromRevSchemaItem.label === 'string') {
      const formRevSchemaItemLabel
        = fromRevSchemaItem.label.toLocaleLowerCase().replace(/:$/, '');
      matchingItemsFromLabel = toRevSchemaIndex[formRevSchemaItemLabel];
    }

    // The fields from the new schema that match.
    const matchingItems: FormFieldSchema[] = matchingItemsFromLabel ?? matchingItemsFromName ?? [];

    for (const matchingItem of matchingItems) {
      const isMatching = checkSpecialFields(fromRevSchemaItem, matchingItem);
      if (!isMatching) {
        continue;
      }

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

export const getRevById = <T extends { id: string | number }>(list: T[], id: string | number): T | undefined =>
  list.find((item) => item.id === id);

export function promptUserToRerunScan (rerunScanDetails: MismatchResponse): {
  msgParts: string[]
  isPromptUserToScan: boolean
} {
  const msgParts: string[] = [];
  let isPromptUserToScan = false;

  if (rerunScanDetails.irrelevantScanIds?.length > 0) {
    isPromptUserToScan = true;
    msgParts.push(translate('bulk.migration.scan.entries.message', { count: rerunScanDetails.irrelevantScanIds?.length, action: 'removed' }));
  }

  if (rerunScanDetails.mismatchingStatusScanIds?.length > 0) {
    isPromptUserToScan = true;
    msgParts.push(translate('bulk.migration.scan.status.message', { count: rerunScanDetails.mismatchingStatusScanIds?.length }));
  }

  if (rerunScanDetails.newRevIds?.length > 0) {
    isPromptUserToScan = true;
    msgParts.push(translate('bulk.migration.scan.entries.message', { count: rerunScanDetails.newRevIds.length, action: 'added' }));
  }

  if (rerunScanDetails.alreadyUpgradedScanEntryIds && rerunScanDetails.alreadyUpgradedScanEntryIds?.length > 0) {
    isPromptUserToScan = true;
    msgParts.push(translate('bulk.migration.scan.entries.message', { count: rerunScanDetails.newRevIds.length, action: 'already migrated' }));
  }

  return { msgParts, isPromptUserToScan };
}
