import { chain, orderBy, uniq } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { CUSTOM_GROUP_ORDER, LCP_KEYS } from './constants';
import { CustomGroupDataItem, CustomGroupOptions, GroupDocTypes, LCP, LCPResponse, processLCPType } from './types';

export const processRealData = (categoriesInfo?: LCPResponse[]): processLCPType => {
  let groups: GroupDocTypes[] = [];
  let phases: LCP[] = [];
  categoriesInfo?.forEach((data: LCPResponse) => {
    const docTypes = data.docTypes;
    groups = groups.concat(docTypes);
    const documentTypeIds = docTypes?.map(data => data.id);
    const group = docTypes?.map(data => data.group);
    const category = uuidv4();
    data.phases = chain(data.phases)
      .sortBy(LCP_KEYS.displayOrder)
      .map((phase) => {
        return {
          ...phase,
          group: group[0],
          category,
          documentTypeId: uniq(documentTypeIds).join(''),
        };
      }).value();
    phases = phases.concat(data.phases);
  });
  return {
    groups: processGroups(groups),
    phases,
  };
};

export const sortGroups = (groups: CustomGroupDataItem[]) => {
  return groups.sort((a, b) => {
    const aIndex = CUSTOM_GROUP_ORDER.indexOf(a.value);
    const bIndex = CUSTOM_GROUP_ORDER.indexOf(b.value);
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

export const processGroups = (groups: GroupDocTypes[]): CustomGroupOptions[] => {
  return groups.map((group) => {
    return {
      label: `${group.documentTypeName} (${group.documentTypeAcronym.replace('-', '')})`,
      value: group.id,
      category: group.group,
    };
  });
};

export const sortPhasesByDisplayOrder = (phases?: LCP[]): LCP[] => {
  return orderBy(phases, [LCP_KEYS.order, LCP_KEYS.displayOrder], ['asc', 'asc']);
};
