import { Group } from "../../../state/ducks/auth/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export const toMembersOptions = (values: GetEmployeeResponse[]): OptionType[] => values.map((employee) => ({
  label: employee.user.name,
  value: employee.id,
}));

export const toOptions = (values: any[]): OptionType[] => values.map((value) => ({
  label: value,
  value,
}));

export const toParentOptions = (values: Group[]): OptionType[] => values.map((value) => ({
  label: value.name,
  value: value.id,
  permissions: value.permissions,
  tags: value.tags,
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

export const toRequestBody = (options: OptionType[] | null) => {
  if (options == null) { return []; }
  return options.map((option) => ({
    id: option.value,
  }));
};
