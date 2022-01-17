import { Avatar, Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { Nullable } from "../../../state/ducks/common/types";
import { getInitalsFromName } from "../../components/icons/avatar/helpers";
import Colors from "../../layout/theme/utils/colors";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      margin: theme.spacing(0, 1, 0, 1),
      fontSize: "18px",
      color: Colors.white,
      background: Colors.aqua_blue,
      fontWeight: 600,
      fontFamily: "Sora",
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

  return (
    <Box>
      {avatar ?
        <Avatar className={classes.avatar} alt={name} src={avatar} /> :
        <Avatar className={classes.avatar} data-cy="header-userInitials">
          {getInitalsFromName(name)}
        </Avatar>
      }
    </Box>
  );
};

export default UserAvatar;
