import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import {
  EmployeeEditRequestBody,
  GroupTag,
} from "../../../state/ducks/auth/types";
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
  const groups = useSelector(authSelectors.getCurrentUserGroups);

  const [showEditUser, setEditUser] = useState(false);
  const showEdit = () => setEditUser(true);
  const closeEdit = () => setEditUser(false);

  const onSubmit = (values: EmployeeEditRequestBody) => dispatch(authActions.editCurrentEmployee(values, async));

  return (
    <UserProfilePresenter
      isOpen={showUserProfile}
      close={closeUserProfile}
      canManageUsers={canManageUsers}
      employeeGroups={groups}
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
