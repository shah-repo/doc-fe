import { Avatar, Box } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../state/ducks/auth';
import { Nullable } from '../../../../state/ducks/common/types';
import AvatarUploadContainer from '../../common/avatar.field/container';
import styles from './avatar.styles';

interface OwnProps {
  avatar: Nullable<string>
  showEditUser: boolean
  previewAvatar: string
  setPreviewAvatar: (value: string) => void
  setFile: (value: Nullable<File>) => void
  userInitials: string
}

type Props = OwnProps;

const AvatarPresenter: React.FunctionComponent<Props> = ({
  avatar,
  showEditUser,
  previewAvatar,
  setPreviewAvatar,
  setFile,
  userInitials,
}) => {
  const classes = styles();
  const bgColor = useSelector(authSelectors.getAvatarInitialColor);

  const avatarRenderer = () => (
    <Box zIndex="modal" position="absolute" alignSelf="baseline">
      {avatar
        ? <img src={previewAvatar || avatar } className={classes.image} alt="Profile" />
        : <Avatar style={{ backgroundColor: `${ bgColor }` }} className={classes.image} data-cy="header-userInitials">
          {userInitials}
        </Avatar>
      }
    </Box>
  );

  return (
    <Box display="flex" justifyContent="center" mt={-16}>
      <Box
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        className={classes.container}
      >
        {avatarRenderer()}
        <AvatarUploadContainer
          setPreviewAvatar={setPreviewAvatar}
          showEditUser={showEditUser}
          setFile={setFile}
        />
      </Box>
    </Box>
  );
};

export default AvatarPresenter;
