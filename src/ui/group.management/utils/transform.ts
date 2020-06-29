import { omit } from "lodash";
import { Group, Permission } from "../../../state/ducks/auth/types";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import { GetEmployeeResponse, LoadCompanyGroup } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";


const restrictedPermissions = [
  Permission.USERS_GET,
];


export const toOptions = (permissions: any[]): OptionType[] =>
  permissions
    .filter((permission) =>
      !restrictedPermissions.includes(permission)
    )
    .map((permission) => ({
      label: permission,
      value: permission,
    }));

export const toArray = (values: OptionType[]): any[] => {
  if (values === null) {
    return [];
  }
  return values.map((value) =>
    value.value,
  );
};

export const toArrayOfIds = (data: any[] | null) => {
  if (!data) { return []; }
  return data.map((item) => ({
    id: item.id,
  }));
};

export const toMembersOptions = (values: GetEmployeeResponse[]): OptionType[] => values.map((employee) => ({
  label: employee.user.name,
  value: employee.id,
}));

export const toParentOptions = (values: Group[]): OptionType[] => values.map((value) => ({
  label: value.name,
  value: value.id,
  permissions: value.permissions,
  tags: value.tags,
  parents: value.parents,
  type: value.type,
}));

export const toGroupOptions = (selectedGroup: LoadCompanyGroup): GroupRequestBody => ({
  name: selectedGroup.name,
  permissions: selectedGroup.permissions,
  defaultForNewUsers: selectedGroup.defaultForNewUsers,
  isOfficial: selectedGroup.isOfficial,
  tags: selectedGroup.tags || [],
  employees: toArrayOfIds(selectedGroup.employees),
  parents: toArrayOfIds(selectedGroup.parents),
});

export const toIds = (options: OptionType[] | null) => {
  if (options == null) { return []; }
  return options.map((option) => ({
    id: option.value,
  }));
};

export const toRequestBody = (
  values: GroupRequestBody,
  members: OptionType[],
  parentGroups: OptionType[]) =>
  ({ ...values, employees: toIds(members), parents: toIds(parentGroups) });


export const toEditRequestBody = (
  isGroupNameChanged: boolean,
  values: GroupRequestBody,
  members: OptionType[],
  parentGroups: OptionType[]
) => isGroupNameChanged ?
  toRequestBody(values, members, parentGroups) :
  omit(toRequestBody(values, members, parentGroups), ["name"] );
