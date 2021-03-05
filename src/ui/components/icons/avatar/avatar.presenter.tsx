import { Box } from "@material-ui/core";
import React from "react";
import { Nullable } from "../../../../state/ducks/common/types";
import AvatarUploadContainer from "../../common/avatar.field/container";
import styles from "./avatar.styles";

interface OwnProps {
  src: string;
  showEditUser: boolean;
  previewAvatar: string;
  setPreviewAvatar: (value: string) => void;
  setFile: (value: Nullable<File>) => void;
}

type Props = OwnProps;

const AvatarPresenter: React.FunctionComponent<Props> = ({
  src,
  showEditUser,
  previewAvatar,
  setPreviewAvatar,
  setFile,
}) => {
  const classes = styles();

  const avatarRenderer = () => (
    <Box zIndex="modal" position="absolute" alignSelf="baseline">
      <img src={previewAvatar || src} className={classes.image} alt="Profile" />
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
