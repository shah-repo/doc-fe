import React from "react";
import AvatarPresenter from "./avatar.presenter";

const AvatarContainer: React.FunctionComponent = () => {

  const logo = "/avatar_placeholder.svg";
  return (
      <AvatarPresenter src={logo} />
  );
};

export default AvatarContainer;
