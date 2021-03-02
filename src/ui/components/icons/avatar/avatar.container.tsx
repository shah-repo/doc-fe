import React from "react";
import { Nullable } from "../../../../state/ducks/common/types";
import AvatarPresenter from "./avatar.presenter";

interface OwnProps {
  avatar: string | null;
  showEditUser: boolean;
  previewAvatar: string;
  setPreviewAvatar: (value: string) => void;
  setFile: (value: Nullable<File>) => void;
}

type Props = OwnProps;
const AvatarContainer: React.FunctionComponent<Props> = ({
  avatar,
  showEditUser,
  previewAvatar,
  setPreviewAvatar,
  setFile,
}) => {
  const logo = !avatar ? "/avatar_placeholder.svg" : avatar;
  return (
    <AvatarPresenter
      src={logo}
      showEditUser={showEditUser}
      previewAvatar={previewAvatar}
      setPreviewAvatar={setPreviewAvatar}
      setFile={setFile}
    />
  );
};

export default AvatarContainer;
