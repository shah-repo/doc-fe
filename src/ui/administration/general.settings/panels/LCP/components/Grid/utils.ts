import { v4 as uuidv4 } from 'uuid';
import { CUSTOM_GROUP_ORDER } from './constants';
import { CustomGroupDataItem, GroupDocTypes, LCP, LCPResponse, processLCPType } from './types';

export const processRealData = (categoriesInfo: LCPResponse[]): processLCPType => {
  let groups: GroupDocTypes[] = [];
  let phases: LCP[] = [];
  categoriesInfo.forEach((data: LCPResponse) => {
    const docTypes = data.docTypes;
    groups = groups.concat(docTypes);
    const documentTypeIdArr = docTypes?.map(data => data.id);
    const group = docTypes?.map(data => data.group);
    const category = uuidv4();
    data.phases = data.phases.map((phase) => {
      return {
        ...phase,
        group: group[0],
        category,
        documentTypeIdArr,
      };
    });
    phases = phases.concat(data.phases);
  });
  return {
    groups: groups.map((group) => {
      return {
        label: `${group.documentTypeName} (${group.documentTypeAcronym.replace('-', '')})`,
        value: group.id,
        category: group.group,
      };
    }),
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
