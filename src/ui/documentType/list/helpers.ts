import { GroupTag } from "../../../state/ducks/auth/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export const filterSecurityGroupsForQms = (isQms = false, groupOptions) => {
  if (!isQms) {
    return [];
  }
  return groupOptions.reduce((acc, group) => {
    if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
      acc.push({ value: group.value, label: group.label });
    }
    return acc;
  }, [] as OptionType[]);
};

