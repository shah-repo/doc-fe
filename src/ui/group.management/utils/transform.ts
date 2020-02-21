import { Employee } from "../../../state/ducks/company";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export const toMembersOptions = (values: GetEmployeeResponse[]): OptionType[] => {
        return values.map((employee) => ({
            label: employee.user.name,
            value: employee.id,
        }));
  };

export const toOptions = (values: any[]): OptionType[] => {
    return values.map((value) => ({
        label: value,
        value,
    }));
};

export const toArray = (values: OptionType[]): any[] => {
    if (values === null) {
        return [];
    }
    return values.map((value) =>
        value.value,
    );
};
export const toEmployeeIds = (employees: Employee[] | null) => {
    if (!employees) {return []; }
    return employees.map((employee) => ({
                id: employee.id,
        }));
};

export const toMembersEditRequestBody = (members: OptionType[] | null) => {
    if (members == null) {return []; }
    return members.map((member) => ({
            id: member.value,
        }));
};
