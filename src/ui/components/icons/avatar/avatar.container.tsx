import React from 'react';
import { Nullable } from '../../../../state/ducks/common/types';
import AvatarPresenter from './avatar.presenter';
import { getInitalsFromName } from './helpers';

interface OwnProps {
  avatar: string | null;
  showEditUser: boolean;
  previewAvatar: string;
  setPreviewAvatar: (value: string) => void;
  setFile: (value: Nullable<File>) => void;
  name: string;
}

type Props = OwnProps;
const AvatarContainer: React.FunctionComponent<Props> = ({
  avatar,
  showEditUser,
  previewAvatar,
  setPreviewAvatar,
  setFile,
  name,
}) => {
  const userInitials = getInitalsFromName(name);

  return (
    <AvatarPresenter
      {...{
        avatar,
        showEditUser,
        previewAvatar,
        setPreviewAvatar,
        setFile,
        userInitials,
      }}
    />
  );
};

export default AvatarContainer;
