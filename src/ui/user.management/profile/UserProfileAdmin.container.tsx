import React from "react";
import { useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { GroupTag } from "../../../state/ducks/auth/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import UserProfilePresenter from "./UserProfile.presenter";

interface OwnProps {
    closeUserProfile: () => void;
    showUserProfile: boolean;
    selectedEmployee: GetEmployeeResponse;
}

export type Props = OwnProps;

export const UserProfileAdminContainer: React.FunctionComponent<Props> = ({
    showUserProfile,
    closeUserProfile,
    selectedEmployee,
}) => {
    const { groups } = selectedEmployee;
    const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));

    const employeeGroups: OptionType[] = groups.map((group) => ({
        value: group.id,
        label: group.name,
    }));

    return (
        <UserProfilePresenter
            isOpen={showUserProfile}
            close={closeUserProfile}
            canManageUsers={canManageUsers}
            employeeGroups={employeeGroups}
            employee={selectedEmployee}
        />
    );
};

export default UserProfileAdminContainer;
