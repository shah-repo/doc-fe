import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { getHasPermission } from "../../../common/utils/selectors";
import Config from "../../../config";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { EmployeeEditRequestBody, GroupTag, Permission } from "../../../state/ducks/auth/types";
import { companySelectors } from "../../../state/ducks/company";
import { Employee } from "../../../state/ducks/company/types";
import { userManagementActions } from "../../../state/ducks/userManagement";
import { USER_SLACK_URL } from "../../../state/ducks/userManagement/constants";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";
import { ApplicationState } from "../../../state/reducers";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useAsync from "../../hooks/useAsync";
import useGetHasTag from "../../hooks/useGetHasTag";
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
  slackTeamId: string;
  employees: Employee[];
}

type Props = OwnProps & DispatchProps & StateProps;

const UserProfileAdminContainer: React.FunctionComponent<Props> = ({
  showUserProfile,
  closeUserProfile,
  selectedEmployee,
  editSelectedEmployee,
  getSlackUrl,
  isSlackIntegrationEnabled,
  slackTeamId,
}) => {
  const userSlackId = useSelector(authSelectors.currentSlackUserId);
  const isDeveloper = useSelector(getHasPermission(Permission.DEVELOPERS));
  const canUpdateCompany = useSelector(getHasPermission(Permission.COMPANY_UPDATE_CURRENT));
  const canManageUsers = useGetHasTag(GroupTag.USER_MANAGEMENT);

  const [realUser, setRealUser] = useState<any>({ user: {}, groups: [] });
  const [showEditUser, setEditUser] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState("");

  const showEdit = () => setEditUser(true);
  const closeEdit = () => setEditUser(false);

  useEffect(() => {
    setRealUser(selectedEmployee);
  }, [selectedEmployee, setRealUser]);

  const { groups, id, active } = realUser;
  const { name, avatar, email } = realUser.user;

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
          avatar: data.avatar,
          name: data.name,
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

  const callbackUpdateActiveStatus = (employee: GetEmployeeResponse) => {
    setRealUser({
      ...realUser,
      active: employee.active,
    });
  };

  const callbackUpdateWithUpload = (avatar: string, name: string) => {
    setRealUser({
      ...realUser,
      user: {
        ...realUser.user,
        avatar,
        name,
      },
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

  const asyncSlack = useAsync<string>({
    onSuccess: (slackUrl) => {
      window.open(slackUrl);
    },
  });

  const onAdd = () => {
    asyncSlack.start(getSlackUrl, Config.SlackUserUri, USER_SLACK_URL, asyncSlack);
  };

  return (
    <UserProfilePresenter
      canUpdateCompany={canUpdateCompany}
      isOpen={showUserProfile}
      close={closeUserProfile}
      canManageUsers={canManageUsers}
      employeeGroups={employeeGroups}
      name={name}
      avatar={avatar}
      email={email}
      employeeId={id}
      editCurrentEmployee={submitChanges}
      showEditUser={showEditUser}
      showEdit={showEdit}
      closeEdit={closeEdit}
      callbackUpdateGroups={callbackUpdateGroups}
      asyncState={asyncSlack.asyncState}
      getUrl={onAdd}
      slackIntegrationEnabled={isSlackIntegrationEnabled}
      slackTeamId={slackTeamId}
      slackUserId={userSlackId}
      previewAvatar={previewAvatar}
      setPreviewAvatar={setPreviewAvatar}
      callbackUpdateActiveStatus={callbackUpdateActiveStatus}
      activeStatus={active}
      userId={realUser.user.id}
      callbackUpdateWithUpload={callbackUpdateWithUpload}
      isDeveloper={isDeveloper}
    />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isSlackIntegrationEnabled: companySelectors.isSlackIntegrationEnabled(state),
  slackTeamId: companySelectors.slackTeamId(state),
  employees: authSelectors.employees(state),
});

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  editSelectedEmployee: authActions.editSelectedEmployee,
  getSlackUrl: userManagementActions.getSlackUrl,
})(UserProfileAdminContainer);
