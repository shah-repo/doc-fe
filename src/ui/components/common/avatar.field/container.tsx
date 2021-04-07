import { Box, Link } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { Nullable } from "../../../../state/ducks/common/types";
import Text from "../../Text";
import styles from "./utils/styles";


interface OwnProps {
  showEditUser: boolean;
  setPreviewAvatar: (values: string) => void;
  setFile: (value: Nullable<File>) => void;
}

type Props = OwnProps;

const AvatarUploadContainer: React.FunctionComponent<Props> = ({
  showEditUser,
  setPreviewAvatar,
  setFile,
}) => {
  const classes = styles();
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files && event.currentTarget.files[0];
    setPreviewAvatar(URL.createObjectURL(file));
    setFile(file);
  };

  return (
    <Box
      zIndex="tooltip"
      className={classNames(classes.buttonDisabled, {
        [classes.buttonEnabled]: showEditUser,
      })}
    >
      <input
        accept="image/png, image/jpeg"
        id={"AvatarUploadContainer-avatar"}
        type="file"
        style={{ display: "none" }}
        onChange={onChange}
      />
      <label htmlFor={"AvatarUploadContainer-avatar"}>
        <Link variant="button" className={classes.link} id="AvatarUploadContainer-uploadPhoto">
          <Text translation="common.upload.photo" />
        </Link>
      </label>
    </Box>
  );
};

export default AvatarUploadContainer;
