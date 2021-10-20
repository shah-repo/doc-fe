import { Avatar, Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { Nullable } from "../../../state/ducks/common/types";
import { getInitalsFromName } from "../../components/icons/avatar/avatar.container";
import Colors from "../../layout/theme/utils/colors";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      margin: theme.spacing(0.7, 1, 0, 0),
      fontSize: "10px",
      color: Colors.white,
    },
  }));

interface Props {
  avatar: Nullable<string>;
  name: string;
}

const UserAvatar: React.FunctionComponent<Props> = ({
  avatar,
  name,
}) => {
  const classes = styles();
  const userInitials = getInitalsFromName(name);
  // TO DO: Provide color from BE
  return (
    <Box>
      {avatar ?
        <img src={avatar} className={classes.avatar} alt="UserProfile" /> :
        <Avatar style={{ backgroundColor: "#00ff00" }} className={classes.avatar}>
          {userInitials}
        </Avatar>
      }
    </Box>
  );
};

export default UserAvatar;
