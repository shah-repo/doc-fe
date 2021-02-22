import { Dialog } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authSelectors, EmployeeEditRequestBody } from "../../../state/ducks/auth";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { AsyncState } from "../../../state/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import AvatarContainer from "../../components/icons/avatar/avatar.container";
import DialogContent from "./dialog/DialogContent";
import DialogTitle from "./dialog/DialogTitle";

interface OwnProps {
  isOpen: boolean;
  close: () => void;
  canManageUsers: boolean;
  employeeGroups: OptionType[];
  name: string;
  avatar: string | null;
  email: string;
  editCurrentEmployee: (values: EmployeeEditRequestBody) => void;
  showEditUser: boolean;
  showEdit: () => void;
  closeEdit: () => void;
  employeeId: string;
  callbackUpdateGroups?: (values: GetEmployeeResponse) => void;
  callbackUpdateActiveStatus?: (values: GetEmployeeResponse) => void;
  callbackUpdateWithUpload?: (avatar: string, name: string) => void;
  asyncState: AsyncState;
  getUrl: () => void;
  slackIntegrationEnabled: boolean;
  slackTeamId: string;
  slackUserId: string;
  previewAvatar: string;
  setPreviewAvatar: (value: string) => void;
  activeStatus: boolean;
  userId: string;
  isDeveloper: boolean;
  canUpdateCompany: boolean;
}

type Props = OwnProps;

const UserProfilePresenter: React.FunctionComponent<Props> = ({
  isOpen,
  close,
  canManageUsers,
  employeeGroups,
  name,
  avatar,
  editCurrentEmployee,
  showEditUser,
  showEdit,
  closeEdit,
  employeeId,
  callbackUpdateGroups,
  callbackUpdateActiveStatus,
  asyncState,
  getUrl,
  slackIntegrationEnabled,
  slackTeamId,
  slackUserId,
  email,
  previewAvatar,
  setPreviewAvatar,
  activeStatus,
  userId,
  callbackUpdateWithUpload,
  isDeveloper,
  canUpdateCompany,
}) => {
  const [isUsernameEmpty, setUsernameError] = useState<boolean>(false);
  const currentUserId = useSelector(authSelectors.currentUserId);
  const isCurrentUser = userId === currentUserId;

  const [userInfo, setUserInfo] = useState<EmployeeEditRequestBody>({
    name,
    avatar,
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setUserInfo({ name, avatar });
  }, [avatar, name]);

  const handleCloseEdit = () => {
    closeEdit();
    setPreviewAvatar("");
    setUsernameError(false);
  };
  const handleCloseDialog = () => {
    close();
    handleCloseEdit();
  };

  return (
    <Dialog fullScreen={true} open={isOpen}>
      <DialogTitle
        showEditUser={showEditUser}
        name={name}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        close={handleCloseDialog}
        isUsernameEmpty={isUsernameEmpty}
        setUsernameError={setUsernameError}
      />
      <AvatarContainer
        avatar={avatar}
        showEditUser={showEditUser}
        previewAvatar={previewAvatar}
        setPreviewAvatar={setPreviewAvatar}
        setFile={setFile}
      />
      <DialogContent
        canManageUsers={canManageUsers}
        employeeGroups={employeeGroups}
        employeeId={employeeId}
        callbackUpdateGroups={callbackUpdateGroups}
        callbackUpdateActiveStatus={callbackUpdateActiveStatus}
        callbackUpdateWithUpload={callbackUpdateWithUpload}
        showEdit={showEdit}
        showEditUser={showEditUser}
        closeEdit={handleCloseEdit}
        userInfo={userInfo}
        editCurrentEmployee={editCurrentEmployee}
        slackIntegrationEnabled={slackIntegrationEnabled}
        slackTeamId={slackTeamId}
        asyncState={asyncState}
        getUrl={getUrl}
        slackUserId={slackUserId}
        email={email}
        activeStatus={activeStatus}
        file={file}
        setFile={setFile}
        setUserInfo={setUserInfo}
        userId={userId}
        isCurrentUser={isCurrentUser}
        isUsernameEmpty={isUsernameEmpty}
        isDeveloper={isDeveloper}
        canUpdateCompany={canUpdateCompany}
      />
    </Dialog>
  );
};

export default UserProfilePresenter;
