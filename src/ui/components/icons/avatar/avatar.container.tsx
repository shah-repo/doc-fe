import React from "react";
import AvatarPresenter from "./avatar.presenter";

interface OwnProps {
  avatar: string | null;
  showEditUser: boolean;
  previewAvatar: string;
  setPreviewAvatar: (value: string) => void;
}

type Props = OwnProps;
const AvatarContainer: React.FunctionComponent<Props> = ({
  avatar,
  showEditUser,
  previewAvatar,
  setPreviewAvatar,
}) => {
  const logo = avatar === null ? "/avatar_placeholder.svg" : avatar;
  return (
    <AvatarPresenter
      src={logo}
      showEditUser={showEditUser}
      previewAvatar={previewAvatar}
      setPreviewAvatar={setPreviewAvatar}
    />
  );
};

export default AvatarContainer;
