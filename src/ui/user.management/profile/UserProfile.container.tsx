import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import {
  EmployeeEditRequestBody,
  Group,
  GroupTag,
} from "../../../state/ducks/auth/types";
import { companySelectors } from "../../../state/ducks/company";
import {
  userManagementActions,
  userManagementSelectors,
} from "../../../state/ducks/userManagement";
import { USER_SLACK_URL } from "../../../state/ducks/userManagement/constants";
import { ApplicationState } from "../../../state/reducers";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import UserProfilePresenter from "./UserProfile.presenter";

interface OwnProps {
  closeUserProfile: () => void;
  showUserProfile: boolean;
}

interface StateProps {
  isSlackIntegrationEnabled: boolean;
  slackUrl: string;
}

interface DispatchProps {
  editCurrentEmployee: typeof authActions.editCurrentEmployee;
  getSlackUrl: typeof userManagementActions.getSlackUrl;
}

export type Props = OwnProps & DispatchProps & StateProps;

export const UserProfileContainer: React.FunctionComponent<Props> = ({
  closeUserProfile,
  showUserProfile,
  editCurrentEmployee,
  getSlackUrl,
  isSlackIntegrationEnabled,
  slackUrl,
}) => {
  const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));
  const name = useSelector(authSelectors.currentUserName);
  const avatar = useSelector(authSelectors.currentEmployeeAvatar);
  const employeeId = useSelector(authSelectors.currentEmployeeId);

  const [showEditUser, setEditUser] = useState(false);
  const showEdit = () => setEditUser(true);
  const closeEdit = () => setEditUser(false);

  const [groupMe, setGroupMe] = useState<OptionType[]>([]);
  const loadGroupsMeAction = useActionCreator(
    userManagementActions.loadGroupsMe,
  );
  const asyncGroup = useAsync<Group[]>({
    onSuccess: (data = []) => {
      const options: OptionType[] = data.map((group) => ({
        value: group.id,
        label: group.name,
      }));
      setGroupMe(options);
    },
  });
  const loadGroupsMe = () => asyncGroup.start(loadGroupsMeAction, asyncGroup);

  useEffect(() => {
    loadGroupsMe();
  }, []);

  const async = useAsync();
  const onSubmit = (values: EmployeeEditRequestBody) => {
    async.start(editCurrentEmployee, values, async);
  };

  const asyncSlack = useAsync({
    onSuccess: () => {
      window.open(slackUrl);
    },
  });

  const onAdd = () => {
    // string linka ide iz tvog brancha, nije jos mergan u ovaj
    asyncSlack.start(
      getSlackUrl,
      "https://dev.enlil.io/slack/user",
      USER_SLACK_URL,
      asyncSlack,
    );
  };

  return (
    <UserProfilePresenter
      isOpen={showUserProfile}
      close={closeUserProfile}
      canManageUsers={canManageUsers}
      employeeGroups={groupMe}
      name={name}
      avatar={avatar}
      employeeId={employeeId}
      editCurrentEmployee={onSubmit}
      showEditUser={showEditUser}
      showEdit={showEdit}
      closeEdit={closeEdit}
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

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    editCurrentEmployee: authActions.editCurrentEmployee,
    getSlackUrl: userManagementActions.getSlackUrl,
  },
)(UserProfileContainer);
