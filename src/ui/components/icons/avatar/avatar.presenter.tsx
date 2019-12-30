import { Box } from "@material-ui/core";
import React from "react";
import AvatarUploadContainer from "../../common/avatar.field/container";
import styles from "./avatar.styles";

interface OwnProps {
  src: string;
  showEditUser: boolean;
  previewAvatar: string;
  setPreviewAvatar: (value: string) => void;
}

type Props = OwnProps;

const AvatarPresenter: React.FunctionComponent<Props> = ({
  src,
  showEditUser,
  previewAvatar,
  setPreviewAvatar,
}) => {
  const classes = styles();

  const avatarRenderer = () => (
    <Box zIndex="modal" position="absolute" alignSelf="baseline">
      <img src={previewAvatar || src} className={classes.image} alt="Profile photo" />
    </Box>
  );
  return (
    <Box display="flex" justifyContent="center" mt={20}>
      <Box
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        className={classes.container}
      >
        {avatarRenderer()}
        <AvatarUploadContainer setPreviewAvatar={setPreviewAvatar} showEditUser={showEditUser}/>
      </Box>
    </Box>
  );
};

export default AvatarPresenter;
