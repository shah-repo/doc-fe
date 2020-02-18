import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export const transformToEmployeesOptions = (values: GetEmployeeResponse[]): OptionType[] => {
        return values.map((employee) => ({
            label: employee.user.name,
            value: employee.id,
        }));
  };

export const transformToOptions = (values: any[]): OptionType[] => {
    return values.map((value) => ({
        label: value,
        value,
    }));
};

export const transformToArray = (values: OptionType[]): any[] => {
    return values.map((value) =>
        value.value,
    );
};
