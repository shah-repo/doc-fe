import { Box, Link } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import Text from "../../Text";
import styles from "./utils/styles";

interface OwnProps {
  showEditUser: boolean;
  setPreviewAvatar: (values: string) => void;
}

type Props = OwnProps;

const AvatarUploadContainer: React.FunctionComponent<Props> = ({
  showEditUser,
  setPreviewAvatar,
}) => {
  const classes = styles();
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files![0];
    setPreviewAvatar(URL.createObjectURL(file));
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
        id={"profilePhoto"}
        type="file"
        style={{ display: "none" }}
        onChange={onChange}
      />
      <label htmlFor={"profilePhoto"}>
        <Link variant="button" className={classes.link}>
          <Text translation="common.upload.photo" />
        </Link>
      </label>
    </Box>
  );
};

export default AvatarUploadContainer;
