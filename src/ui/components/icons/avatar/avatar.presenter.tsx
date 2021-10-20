import { Avatar, Box } from "@material-ui/core";
import React from "react";
import { Nullable } from "../../../../state/ducks/common/types";
import AvatarUploadContainer from "../../common/avatar.field/container";
import styles from "./avatar.styles";

interface OwnProps {
  src: Nullable<string>;
  showEditUser: boolean;
  previewAvatar: string;
  setPreviewAvatar: (value: string) => void;
  setFile: (value: Nullable<File>) => void;
  userInitials: string;
}

type Props = OwnProps;

const AvatarPresenter: React.FunctionComponent<Props> = ({
  src,
  showEditUser,
  previewAvatar,
  setPreviewAvatar,
  setFile,
  userInitials,
}) => {
  const classes = styles();
  // TO DO: Provide color from BE
  const avatarRenderer = () => (
    <Box zIndex="modal" position="absolute" alignSelf="baseline">
      {src ?
        <img src={previewAvatar || src } className={classes.image} alt="Profile" /> :
        <Avatar style={{ backgroundColor: "#00ff00" }} className={classes.image}>
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
