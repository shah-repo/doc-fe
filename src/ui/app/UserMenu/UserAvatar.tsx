import { Avatar, Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { Nullable } from "../../../state/ducks/common/types";
import { getInitalsFromName } from "../../components/icons/avatar/helpers";
import Colors from "../../layout/theme/utils/colors";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: "48px",
      height: "47px",
      borderRadius: "50%",
      margin: theme.spacing(0.7, 1, 0, 0),
      fontSize: "12px",
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
  const bgColor = useSelector(authSelectors.getAvatarInitialColor);

  return (
    <Box>
      {avatar ?
        <img src={avatar} className={classes.avatar} alt="UserProfile" /> :
        <Avatar style={{ backgroundColor: `${ bgColor }` }} className={classes.avatar}>
          {getInitalsFromName(name)}
        </Avatar>
      }
    </Box>
  );
};

export default UserAvatar;
