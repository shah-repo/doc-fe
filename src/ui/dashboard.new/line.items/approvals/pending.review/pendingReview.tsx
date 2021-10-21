import { Collapse, IconButton, List } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/myfeed.expand.svg";
import { ReactComponent as MinizeIcon } from "../../../../../assets/images/myfeed.mimimize.svg";
import { ReactComponent as RecentHoveredIcon } from "../../../../../assets/images/myfeed_recent_white.svg";
import { ReactComponent as PendingReviewIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as PendinngReviewItemIcon } from "../../../../../assets/images/pending_review_nested.svg";
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
  const NormalStyleChip = withStyles({
    root: {
      backgroundColor: Colors.white,
      color: Colors.latest_blue_varient,
    },
  })(Chip);

  const HoverStyleChip = withStyles({
    root: {
      backgroundColor: Colors.latest_blue_varient,
      color: Colors.white,
    },
  })(Chip);

  const [open, setOpen] = React.useState(false);
  const [hoverItem, setHoverItem] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const onhoverItem = () => {
    setHoverItem(!hoverItem);
  };
  const onMouseLeaveItem = () => {
    setHoverItem(!hoverItem);
  };
  // eslint-disable-next-line no-console
  console.log(" Pending Review Presenter :::");
  return (
    <>
      <ListItem button onClick={handleClick} onMouseEnter={onhoverItem} onMouseLeave={onMouseLeaveItem}>
        {open ? <MinizeIcon className={classes.icon}/> : <ExpandIcon className={classes.icon}/>}
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
                  {id}&nbsp;
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typographyBold}
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
                  {!hoverItem &&
                  <NormalStyleChip size="small" icon={<RecentSelectedIcon />}
                    label={status}/>}
                  {hoverItem && <HoverStyleChip size="small" icon={<RecentHoveredIcon/>}
                    label={status}/>}
                </Typography>&nbsp;
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typographyBold}
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
        <List dense disablePadding >
          <ListItem button className={classes.nested}>
            <IconButton aria-label="listIcon">
              <PendinngReviewItemIcon />
            </IconButton>
            <ListItemText id={id} primary={ <Typography
              component="span"
              variant="body2"
              className={classes.typography}
              color="textPrimary"
            >
              {"1. SI-02053 . Rev 1 - Micro - Hematocrit Capillary Test Tube"}
            </Typography> } />
          </ListItem>
          <ListItem button className={classes.nested}>
            <IconButton aria-label="listIcon">
              <PendinngReviewItemIcon />
            </IconButton>
            <ListItemText id={id}
              primary={ <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                { "2. SI-02060 . Rev 2A - 100-1000µL Pipette Tip" }
              </Typography> }/>
          </ListItem>
          <ListItem button className={classes.nested}>
            <IconButton aria-label="listIcon">
              <PendinngReviewItemIcon />
            </IconButton>
            <ListItemText id={id}
              primary={ <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                { "3. SI-02062 . Rev 1 - 5mL Pipette Tip" }
              </Typography> }/>
          </ListItem>
          <ListItem button className={classes.nested}>
            <IconButton aria-label="listIcon">
              <PendinngReviewItemIcon />
            </IconButton>
            <ListItemText id={id} className= {classes.typography}
              primary={ <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                { "4. SI-02066 . Rev B - 304 Stainless Steel Ball, 1/8 Diameter" }  </Typography> }/>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};

export default PendingReviewPresenter;


