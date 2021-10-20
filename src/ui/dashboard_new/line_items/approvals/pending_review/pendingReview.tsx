import { Collapse, IconButton, List } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListIcon from "@material-ui/icons/List";
import SendIcon from "@material-ui/icons/Send";
import React from "react";
import { styles } from "./pendingReview.styles";

interface Props {
  id: string;
  type: string;
  title: string;
  documentId: string;
  status: string;
  timestamp: string;
  approvers: string[];
}
const PendingReviewPresenter: React.FunctionComponent<Props> = ({
  id, type, title,
}) => {
  const classes = styles();
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  // eslint-disable-next-line no-console
  console.log("PendingReviewPresenter");
  return (
    <>
      <ListItem button onClick={handleClick}>
        {open ? <ChevronRight /> : <ExpandMore />}
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
            {" — Keep some text here…"}
          </React.Fragment>
        } />

      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense disablePadding>
          <ListItem className={classes.nested}>
            <IconButton aria-label="listIcon">
              <ListIcon fontSize="small" />
            </IconButton>
            <ListItemText id={id} primary={ "This is sub list item 1" } />
          </ListItem>
          <ListItem className={classes.nested}>
            <IconButton aria-label="listIcon">
              <ListIcon fontSize="small" />
            </IconButton>
            <ListItemText id={id} primary={ "This is sub list item 2" } />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};

export default PendingReviewPresenter;
