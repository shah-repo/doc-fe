import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      margin: theme.spacing(0.7, 1, 0, 0),
    },
  }));

interface Props {
  avatar: string | null;
}

const UserAvatar: React.FunctionComponent<Props> = ({
  avatar,
}) => {
  const classes = styles();
  const logo = !avatar ? "/avatar_placeholder.svg" : avatar;
  return (
    <Box>
      <img className={classes.avatar} src={logo}  alt="UserProfile" />
    </Box>
  );
};

export default UserAvatar;
