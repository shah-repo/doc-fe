import { EmployeeGroupsEditRequestBody } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";

export const toEmployeeGroupsEditRequestBody = (employeeGroups: OptionType[] | null):
EmployeeGroupsEditRequestBody => {
    if (employeeGroups == null) {return {groups: []}; }

    const employeeGroupsEditRequestBody: EmployeeGroupsEditRequestBody = {
        groups: employeeGroups.map((group) => ({
            id: group.value,
        })),
    };
    return employeeGroupsEditRequestBody;
};
