import { GroupTag } from '../../../state/ducks/auth/types';
import { GroupOption } from '../../../state/ducks/userManagement/types';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';

export const filterSecurityGroupsForQms = (groupOptions: GroupOption[], isQms = false): OptionType[] => {
  if (!isQms) {
    return [];
  }
  return groupOptions.reduce<OptionType[]>((acc, group) => {
    if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
      acc.push({ value: group.value, label: group.label });
    }
    return acc;
  }, []);
};
