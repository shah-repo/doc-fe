import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { authActions } from "../../../state/ducks/auth";
import { GroupTag, UserMeEditRequestBody } from "../../../state/ducks/auth/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useAsync from "../../hooks/useAsync";
import UserProfilePresenter from "./UserProfile.presenter";

interface OwnProps {
    closeUserProfile: () => void;
    showUserProfile: boolean;
    selectedEmployee: GetEmployeeResponse;
}

interface DispatchProps {
    editCurrentEmployee: typeof authActions.editCurrentEmployee;
}

export type Props = OwnProps & DispatchProps;

export const UserProfileAdminContainer: React.FunctionComponent<Props> = ({
    showUserProfile,
    closeUserProfile,
    selectedEmployee,
    editCurrentEmployee,
}) => {
    const { groups, id } = selectedEmployee;
    const { name } = selectedEmployee.user;

    const [showEditUser, setEditUser] = useState(false);
    const showEdit = () => setEditUser(true);
    const closeEdit = () => setEditUser(false);

    const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));

    const employeeGroups: OptionType[] = groups.map((group) => ({
        value: group.id,
        label: group.name,
    }));
    const async = useAsync();

    const onSubmit = (values: UserMeEditRequestBody) => {
        async.start(
            editCurrentEmployee,
            values,
          async,
        );
      };
    return (
        <UserProfilePresenter
            isOpen={showUserProfile}
            close={closeUserProfile}
            canManageUsers={canManageUsers}
            employeeGroups={employeeGroups}
            name={name}
            avatar={null}
            employeeId={id}
            editCurrentEmployee={onSubmit}
            showEditUser={showEditUser}
            showEdit={showEdit}
            closeEdit={closeEdit}
        />
    );
};

export default connect<{}, DispatchProps, OwnProps, {}>(null, {
    editCurrentEmployee: authActions.editCurrentEmployee,
  })(UserProfileAdminContainer);
