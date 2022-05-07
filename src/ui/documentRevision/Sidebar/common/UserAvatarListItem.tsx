import { Avatar, createStyles, ListItem, ListItemAvatar, ListItemText, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { Owner } from "../../../../state/ducks/common/types";
import { getInitalsFromName } from "../../../components/icons/avatar/helpers";
import Colors from "../../../layout/theme/utils/colors";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    auditListItem: {
      margin: "0px",
      padding: "0px",
      marginBottom: "12px",
      marginTop: "14px",
    },
    primaryText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "21px",
      color: Colors.almost_black,
    },
    secondaryText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "12px",
      color: Colors.font_gray,
    },
    avatar: ({ initialColor }) => ({
      width: "35px",
      height: "35px",
      fontWeight: 600,
      color: Colors.white,
      fontFamily: "Sora",
      borderRadius: "50%",
      fontSize: "12px",
      background: `${initialColor}`,
    }),
  }));

interface Props {
  owner: Owner;
  secondaryComponent: JSX.Element;
  name: string;
}

const UserAvatarListItem: React.FunctionComponent<Props> = ({
  owner,
  secondaryComponent,
  name,
}) => {
  const classes = styles({ initialColor: owner.user.initialColor });
  return (
    <>
      <ListItem alignItems="flex-start" disableGutters className={classes.auditListItem}>
        <ListItemAvatar style={{ minWidth: 42 }}>
          {owner.user.avatar ? (
            <Avatar
              className={classes.avatar}
              alt={owner.user.name}
              src={owner.user.avatar || ""}
            />
          ) : (
            <Avatar
              className={classes.avatar}
              style={{ background: owner.user.initialColor }}
            >
              {getInitalsFromName(owner.user.name)}
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Typography className={classes.primaryText}>{name}</Typography>)}
          secondary={
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
              className={classes.secondaryText}
            >
              {secondaryComponent}
            </Typography>
          }
        />
      </ListItem>
    </>
  );
};

export default UserAvatarListItem;
