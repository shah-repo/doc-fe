import { uniq } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { CUSTOM_GROUP_ORDER, LCP_KEYS } from './constants';
import {
  CustomGroupDataItem,
  CustomGroupOptions,
  GroupDocTypes,
  LCP,
  LCPResponse,
  processLCPType,
} from './types';

export const processRealData = (
  categoriesInfo?: LCPResponse[],
): processLCPType => {
  const groups: GroupDocTypes[] = [];
  const phases: LCP[] = [];

  if (categoriesInfo) {
    categoriesInfo.forEach((data: LCPResponse) => {
      const { docTypes = [], phases: dataPhases = [] } = data;
      groups.push(...docTypes);
      const documentTypeIds = docTypes.map((docType) => docType.id);
      const group = docTypes.length > 0 ? docTypes[0].group : '';
      const uniqueDocumentTypeId = uniq(documentTypeIds).join('');
      const category = uuidv4();
      const sortedPhases = dataPhases
        .sort(
          (phase1, phase2) =>
            (phase1[LCP_KEYS.displayOrder] ?? 0)
            - (phase2[LCP_KEYS.displayOrder] ?? 0),
        )
        .map((phase) => ({
          ...phase,
          group,
          category,
          documentTypeId: uniqueDocumentTypeId,
        }));
      phases.push(...sortedPhases);
    });
  }

  return {
    groups: processGroups(groups),
    phases,
  };
};

export const sortGroups = (
  groups: CustomGroupDataItem[],
  selectedOrder?: string,
): CustomGroupDataItem[] => {
  const sortOrder = [...(selectedOrder ? [selectedOrder] : []), ...CUSTOM_GROUP_ORDER];

  return groups.sort((a, b) => {
    const aIndex = sortOrder.indexOf(a.value);
    const bIndex = sortOrder.indexOf(b.value);
    if (aIndex === -1 && bIndex === -1) {
      return a.value.localeCompare(b.value);
    }
    if (aIndex === -1) {
      return 1;
    }
    if (bIndex === -1) {
      return -1;
    }
    return aIndex - bIndex;
  });
};

export const processGroups = (
  groups: GroupDocTypes[],
): CustomGroupOptions[] => {
  return groups.map(({ id, documentTypeName, documentTypeAcronym, group }) => ({
    label: `${documentTypeName} (${documentTypeAcronym.replace('-', '')})`,
    value: id,
    category: group,
    docTypeAcronym: documentTypeAcronym,
  }));
};

export const sortPhasesByDisplayOrder = (phases?: LCP[]): LCP[] => {
  if (!phases?.length) return [];

  return [...phases].sort((phase1, phase2) => {
    const orderComparison
      = (phase1[LCP_KEYS.order] ?? 0) - (phase2[LCP_KEYS.order] ?? 0);
    if (orderComparison !== 0) return orderComparison;

    return (
      (phase1[LCP_KEYS.displayOrder] ?? 0)
      - (phase2[LCP_KEYS.displayOrder] ?? 0)
    );
  });
};

export const isGroupActivateOrDeactivate = (
  phases: LCP[],
  activate: boolean,
): boolean => {
  if (!phases?.length) return false;

  for (const phase of phases) {
    if (phase.isActive !== activate) {
      return false;
    }
  }
  return true;
};
