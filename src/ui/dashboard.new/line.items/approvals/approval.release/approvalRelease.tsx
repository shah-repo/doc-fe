import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";
import React from "react";
import { styles } from "./approvalRelease.styles";

interface Props {
  id: string;
  type: string;
  title: string;
  documentId: string;
  status: string;
  timestamp: string;
  approvers: string[];
  verbose: string;
}
const approvalReleasePresenter: React.FunctionComponent<Props> = ({
  id, title,
}) => {
  const classes = styles();
  // eslint-disable-next-line no-console
  console.log("approvalReleasePresenter");
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar>
          <SendIcon />
        </Avatar>
      </ListItemAvatar>
      {/* <ListItemIcon>
        <SendIcon />
      </ListItemIcon> */}
      <ListItemText primary= {
        <React.Fragment>
          <Typography
            component="span"
            variant="body2"
            className={classes.inline}
            color="textPrimary"
          >
            <b>{id} </b>
          </Typography>
          - {title}
          {" — Approval Release …"}
        </React.Fragment>
      } />

    </ListItem>
  );
};

export default approvalReleasePresenter;
