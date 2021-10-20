import { Collapse, IconButton, List } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListIcon from "@material-ui/icons/List";
import React from "react";
import { ReactComponent as PendingReviewIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as RecentSelectedIcon } from "../../../../../assets/images/recent_selected_myfeed_li.svg";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./pendingReview.styles";

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
const PendingReviewPresenter: React.FunctionComponent<Props> = ({
  id, status, title, verbose, timestamp,
}) => {
  const classes = styles();
  const StyleChip = withStyles({
    root: {
      backgroundColor: Colors.white,
    },
    colorPrimary: {
      color: Colors.latest_blue_varient,
    },
  })(Chip);
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  // eslint-disable-next-line no-console
  console.log("PendingReviewPresenter :::");
  return (
    <>
      <ListItem button onClick={handleClick}>
        {open ? <ChevronRight /> : <ExpandMore />}
        <ListItemIcon>
          <PendingReviewIcon />
        </ListItemIcon>
        <ListItemText primary= {
          <React.Fragment>
            <Grid container={true}>
              <Grid item={true} md={12} sm={12} >
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  <b>{id} </b>
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  {title}
                </Typography>&nbsp;
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  <StyleChip size="small" icon={<RecentSelectedIcon />}
                    color="primary" label={status}/>
                </Typography>&nbsp;
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  {verbose}
                </Typography>
              </Grid>
            </Grid>
            <Grid container={true} >
              <Grid item={true} md={12} sm={12} >
                <Typography
                  component="span"
                  variant="caption"
                  className={classes.timestampContainer}
                  color="textSecondary"
                >
                . {timestamp}
                </Typography>
              </Grid>
            </Grid>
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


