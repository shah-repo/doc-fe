import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { authActions } from "../../../state/ducks/auth";
import { EmployeeEditRequestBody, GroupTag } from "../../../state/ducks/auth/types";
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
    editSelectedEmployee: typeof authActions.editSelectedEmployee;
}

export type Props = OwnProps & DispatchProps;

export const UserProfileAdminContainer: React.FunctionComponent<Props> = ({
    showUserProfile,
    closeUserProfile,
    selectedEmployee,
    editSelectedEmployee,
}) => {
    const [realUser, setRealUser] = useState<any>({ user: {}, groups: []});
    useEffect(() => {
        setRealUser(selectedEmployee);
    }, [selectedEmployee.id]);
    const { groups, id } = realUser;
    const { name } = realUser.user;

    const [showEditUser, setEditUser] = useState(false);
    const showEdit = () => setEditUser(true);
    const closeEdit = () => setEditUser(false);

    const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));

    const employeeGroups: OptionType[] = groups.map((group: any) => ({
        value: group.id,
        label: group.name,
    }));

    const async = useAsync({
        onSuccess: (data: any) => {
            setRealUser({
                ...realUser,
                user: {
                    ...realUser.user,
                    avatar: data!.avatar,
                    name: data!.name,
                },
            });
        },
    });

    const callbackUpdateGroups = (employee: GetEmployeeResponse) => {
        setRealUser({
            ...realUser,
            groups: employee.groups,
        });
    };

    const submitChanges = (values: EmployeeEditRequestBody) => {
        async.start(
            editSelectedEmployee,
            realUser.user.id,
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
            editCurrentEmployee={submitChanges}
            showEditUser={showEditUser}
            showEdit={showEdit}
            closeEdit={closeEdit}
            callbackUpdateGroups={callbackUpdateGroups}
        />
    );
};

export default connect<{}, DispatchProps, OwnProps, {}>(null, {
    editSelectedEmployee: authActions.editSelectedEmployee,
  })(UserProfileAdminContainer);
