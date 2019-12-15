import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { authActions } from "../../../state/ducks/auth";
import { EmployeeEditRequestBody, GroupTag } from "../../../state/ducks/auth/types";
import { companySelectors } from "../../../state/ducks/company";
import { GetEmployeeResponse, userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { COMPANY_SLACK_URL } from "../../../state/ducks/userManagement/constants";
import { ApplicationState } from "../../../state/reducers";
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
    getSlackUrl: typeof userManagementActions.getSlackUrl;
}

interface StateProps {
    isSlackIntegrationEnabled: boolean;
    slackUrl: string;
}

export type Props = OwnProps & DispatchProps & StateProps;

export const UserProfileAdminContainer: React.FunctionComponent<Props> = ({
    showUserProfile,
    closeUserProfile,
    selectedEmployee,
    editSelectedEmployee,
    getSlackUrl,
    isSlackIntegrationEnabled,
    slackUrl,
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

    const asyncSlack = useAsync({
        onSuccess: () => {
            window.open(slackUrl);
        },
    });

    const onAdd = () => {
    //  string linka ide iz tvog brancha, nije jos mergan u ovaj
        asyncSlack.start(getSlackUrl, "https://dev.enlil.io/slack/company", COMPANY_SLACK_URL, asyncSlack);
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
            asyncState={asyncSlack.asyncState}
            getUrl={onAdd}
            slackIntegrationEnabled={isSlackIntegrationEnabled}
        />
    );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
    isSlackIntegrationEnabled: companySelectors.isSlackIntegrationEnabled(state),
    slackUrl: userManagementSelectors.slackUrl(state),
  });

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
    editSelectedEmployee: authActions.editSelectedEmployee,
    getSlackUrl: userManagementActions.getSlackUrl,
  })(UserProfileAdminContainer);
