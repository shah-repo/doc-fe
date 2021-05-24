import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getHasPermission } from "../../../common/utils/selectors";
import Config from "../../../config";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { EmployeeEditRequestBody, GroupTag, Permission } from "../../../state/ducks/auth/types";
import { companySelectors } from "../../../state/ducks/company";
import { userManagementActions } from "../../../state/ducks/userManagement";
import { USER_SLACK_URL } from "../../../state/ducks/userManagement/constants";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useGetHasTag from "../../hooks/useGetHasTag";
import UserProfilePresenter from "./UserProfile.presenter";

interface Props {
  closeUserProfile: () => void;
  showUserProfile: boolean;
  selectedEmployee: GetEmployeeResponse;
}

const UserProfileAdminContainer: React.FunctionComponent<Props> = ({
  showUserProfile,
  closeUserProfile,
  selectedEmployee,
}) => {
  const userSlackId = useSelector(authSelectors.currentSlackUserId);
  const isDeveloper = useSelector(getHasPermission(Permission.DEVELOPERS));
  const isSlackIntegrationEnabled = useSelector(companySelectors.isSlackIntegrationEnabled);
  const slackTeamId = useSelector(companySelectors.slackTeamId);
  const canUpdateCompany = useSelector(getHasPermission(Permission.COMPANY_UPDATE_CURRENT));
  const canManageUsers = useGetHasTag(GroupTag.USER_MANAGEMENT);

  const editSelectedEmployeeAction = useActionCreator(authActions.editSelectedEmployee);
  const getSlackUrlAction = useActionCreator(userManagementActions.getSlackUrl);

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
      editSelectedEmployeeAction,
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
    asyncSlack.start(
      getSlackUrlAction,
      Config.SlackUserUri,
      USER_SLACK_URL,
      asyncSlack
    );
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

export default UserProfileAdminContainer;
