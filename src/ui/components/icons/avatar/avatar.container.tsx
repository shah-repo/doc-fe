import React from "react";
import { Nullable } from "../../../../state/ducks/common/types";
import AvatarPresenter from "./avatar.presenter";

interface OwnProps {
  avatar: string | null;
  showEditUser: boolean;
  previewAvatar: string;
  setPreviewAvatar: (value: string) => void;
  setFile: (value: Nullable<File>) => void;
  name: string;
}

export const getInitalsFromName = (name: string) => {
  const array = name.split(" ");
  return array.length <= 1
    ? name.charAt(0) + name.charAt(1)
    : array[0].charAt(0) + array[1].charAt(0);
};

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
      src={avatar}
      showEditUser={showEditUser}
      previewAvatar={previewAvatar}
      setPreviewAvatar={setPreviewAvatar}
      setFile={setFile}
      userInitials={userInitials}
    />
  );
};

export default AvatarContainer;
