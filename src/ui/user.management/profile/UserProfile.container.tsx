import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import {
  EmployeeEditRequestBody,
  Group,
  GroupTag,
} from "../../../state/ducks/auth/types";
import { userManagementActions } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import UserProfilePresenter from "./UserProfile.presenter";

interface OwnProps {
  closeUserProfile: () => void;
  showUserProfile: boolean;
}

export type Props = OwnProps;

export const UserProfileContainer: React.FunctionComponent<Props> = ({
  closeUserProfile,
  showUserProfile,
}) => {
  const async = useAsync();
  const dispatch = useDispatch();

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

  const onSubmit = (values: EmployeeEditRequestBody) => dispatch(authActions.editCurrentEmployee(values, async));

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
    />
  );
};

export default UserProfileContainer;
