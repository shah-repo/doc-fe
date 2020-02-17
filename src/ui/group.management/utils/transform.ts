import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export const transformToEmployeesOptions = (values: GetEmployeeResponse[]): OptionType[] => {

        return values.map((employee) => ({
            label: employee.user.name,
            value: employee.id,
        }));
  };
