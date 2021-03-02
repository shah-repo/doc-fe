import { AddEmployeeRequest } from "../../../../state/ducks/userManagement/types";
import { AddEmployeeFormValues } from "../form.container";

export const transformToAddEmployeeRequest = (values: AddEmployeeFormValues): AddEmployeeRequest => {
  const { name, email } = values;
  const groups = !values.groups || values.groups.length === 0 ?
    [] :
    values.groups.map((group) => ({ id: group.value }));

  return {
    user: {
      id: values.id || undefined,
      name,
      email,
    },
    groups,
  };
};
