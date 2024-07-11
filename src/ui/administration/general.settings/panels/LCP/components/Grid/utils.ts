import { CUSTOM_GROUP_ORDER } from './constants';
import { CustomGroupDataItem } from './types';

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
