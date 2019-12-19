import React from "react";
import AvatarPresenter from "./avatar.presenter";

interface OwnProps {
  avatar: string | null;
}

type Props = OwnProps;
const AvatarContainer: React.FunctionComponent<Props> = ({avatar}) => {

  const logo = avatar === null ? "/avatar_placeholder.svg" : avatar;
  return (
      <AvatarPresenter src={logo} />
  );
};

export default AvatarContainer;
