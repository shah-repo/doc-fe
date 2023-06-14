import { Dialog, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../state/ducks/auth';
import { EmployeeEditRequestBody } from '../../../state/ducks/auth/types';
import { companyActions } from '../../../state/ducks/company';
import { GetEmployeeResponse } from '../../../state/ducks/userManagement/types';
import { AsyncState } from '../../../state/types';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import AvatarContainer from '../../components/icons/avatar/avatar.container';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import DialogContent from './dialog/DialogContent';
import DialogTitle from './dialog/DialogTitle';
import { Translation } from '../../translations/types';

interface OwnProps {
  isOpen: boolean
  close: () => void
  canManageUsers: boolean
  employeeGroups: OptionType[]
  name: string
  avatar: string | null
  email: string
  editCurrentEmployee: (values: EmployeeEditRequestBody) => void
  showEditUser: boolean
  showEdit: () => void
  closeEdit: () => void
  employeeId: string
  callbackUpdateGroups?: (values: GetEmployeeResponse) => void
  callbackUpdateActiveStatus?: (values: GetEmployeeResponse) => void
  callbackUpdateWithUpload?: (avatar: string, name: string) => void
  asyncState: AsyncState
  getUrl: () => void
  slackIntegrationEnabled: boolean
  slackTeamId: string
  slackUserId: string
  previewAvatar: string
  setPreviewAvatar: (value: string) => void
  activeStatus: boolean
  userId: string
  isDeveloper: boolean
  canUpdateCompany: boolean
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
  const [usernameError, setUsernameError] = useState<Translation | null>(null);
  const currentUserId = useSelector(authSelectors.currentUserId);
  const isCurrentUser = userId === currentUserId;
  const getCompanyMine = useActionCreator(companyActions.getCompanyMine);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const async = useAsync();
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
    setPreviewAvatar('');
    setUsernameError(null);
    async.start(getCompanyMine, currentEmployeeId, async);
  };
  const handleCloseDialog = () => {
    close();
    handleCloseEdit();
  };
  const styles = makeStyles(() => ({
    dialogPaper: {
      height: '90%',
      width: '90%',
    },
  }));
  const classes = styles();
  return (
    <Dialog fullScreen={true} classes={{ paper: classes.dialogPaper }}
      open={isOpen}>
      <DialogTitle
        showEditUser={showEditUser}
        name={name}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        close={handleCloseDialog}
        usernameError={usernameError}
        setUsernameError={setUsernameError}
      />
      <AvatarContainer
        {...{
          avatar,
          showEditUser,
          previewAvatar,
          setPreviewAvatar,
          setFile,
          name,
        }}
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
        usernameError={usernameError}
        isDeveloper={isDeveloper}
        canUpdateCompany={canUpdateCompany}
      />
    </Dialog>
  );
};

export default UserProfilePresenter;
