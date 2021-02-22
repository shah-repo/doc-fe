import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { getHasPermission } from "../../../common/utils/selectors";
import Config from "../../../config";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { EmployeeEditRequestBody, GroupTag, Permission } from "../../../state/ducks/auth/types";
import { companySelectors, Employee } from "../../../state/ducks/company";
import { userManagementActions } from "../../../state/ducks/userManagement";
import { USER_SLACK_URL } from "../../../state/ducks/userManagement/constants";
import { ApplicationState } from "../../../state/reducers";
import useAsync from "../../hooks/useAsync";
import useGetHasTag from "../../hooks/useGetHasTag";
import UserProfilePresenter from "./UserProfile.presenter";

interface OwnProps {
  closeUserProfile: () => void;
  showUserProfile: boolean;
}

interface StateProps {
  isSlackIntegrationEnabled: boolean;
  slackTeamId: string;
  employees: Employee[];
}

interface DispatchProps {
  editCurrentEmployee: typeof authActions.editCurrentEmployee;
  getSlackUrl: typeof userManagementActions.getSlackUrl;
}

type Props = OwnProps & DispatchProps & StateProps;

const UserProfileContainer: React.FunctionComponent<Props> = ({
  closeUserProfile,
  showUserProfile,
  getSlackUrl,
  isSlackIntegrationEnabled,
  slackTeamId,
}) => {
  const async = useAsync();
  const dispatch = useDispatch();

  const canUpdateCompany = useSelector(getHasPermission(Permission.COMPANY_UPDATE_CURRENT));
  const canManageUsers = useGetHasTag(GroupTag.USER_MANAGEMENT);
  const isDeveloper = useSelector(getHasPermission(Permission.DEVELOPERS));
  const name = useSelector(authSelectors.currentUserName);
  const avatar = useSelector(authSelectors.currentEmployeeAvatar);
  const email = useSelector(authSelectors.currentUserEmail);
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const groups = useSelector(authSelectors.getCurrentUserGroups);
  const activeStatus = useSelector(authSelectors.currentUserActiveStatus);
  const userSlackId = useSelector(authSelectors.currentSlackUserId);
  const userId = useSelector(authSelectors.currentUserId);
  const [showEditUser, setEditUser] = useState(false);
  const showEdit = () => setEditUser(true);
  const closeEdit = () => setEditUser(false);
  const [previewAvatar, setPreviewAvatar] = useState("");

  const onSubmit = (values: EmployeeEditRequestBody) => dispatch(authActions.editCurrentEmployee(values, async));

  const asyncSlack = useAsync<string>({
    onSuccess: (slackUrl) => {
      window.open(slackUrl);
    },
  });

  const onAdd = () => {
    asyncSlack.start(
      getSlackUrl,
      Config.SlackUserUri,
      USER_SLACK_URL,
      asyncSlack,
    );
  };

  return (
    <UserProfilePresenter
      isOpen={showUserProfile}
      close={closeUserProfile}
      canManageUsers={canManageUsers}
      canUpdateCompany={canUpdateCompany}
      employeeGroups={groups}
      name={name}
      avatar={avatar}
      email={email}
      employeeId={employeeId}
      editCurrentEmployee={onSubmit}
      showEditUser={showEditUser}
      showEdit={showEdit}
      closeEdit={closeEdit}
      asyncState={asyncSlack.asyncState}
      getUrl={onAdd}
      slackIntegrationEnabled={isSlackIntegrationEnabled}
      slackTeamId={slackTeamId}
      slackUserId={userSlackId}
      previewAvatar={previewAvatar}
      setPreviewAvatar={setPreviewAvatar}
      activeStatus={activeStatus}
      userId={userId}
      isDeveloper={isDeveloper}
    />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isSlackIntegrationEnabled: companySelectors.isSlackIntegrationEnabled(state),
  slackTeamId: companySelectors.slackTeamId(state),
  employees: authSelectors.employees(state),
});

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    editCurrentEmployee: authActions.editCurrentEmployee,
    getSlackUrl: userManagementActions.getSlackUrl,
  },
)(UserProfileContainer);
