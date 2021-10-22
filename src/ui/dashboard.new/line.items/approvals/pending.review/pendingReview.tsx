/* eslint-disable no-console */
import { Collapse, IconButton, List } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as InReviewWhiteIcon } from "../../../../../assets/images/in_review_status.svg";
import { ReactComponent as InReviewIcon } from "../../../../../assets/images/in_review_status_white.svg";
import { ReactComponent as PendingReviewIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as PendingReviewItemIcon } from "../../../../../assets/images/pending_review_nested.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as ViewIcon } from "../../../../../assets/images/view.svg";
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
  id,
  status,
  title,
  verbose,
  timestamp,
  approvers,
}) => {
  const classes = styles();

  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);

  const NormalStyleChip = withStyles({
    root: {
      backgroundColor: Colors.white,
      borderRadius: "3px",
    },
    colorPrimary: {
      color: Colors.latest_blue_varient,
    },
  })(Chip);

  const HoverStyleChip = withStyles({
    root: {
      backgroundColor: Colors.latest_blue_varient,
      borderRadius: "3px",
    },
    colorPrimary: {
      color: Colors.white,
    },
  })(Chip);

  const [open, setOpen] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [viewItem, setViewItem] = React.useState(false);
  const [hoverItem, setHoverItem] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const handlePinClick = () => {
    console.log("Pin Clicked");
    setPinned(!pinned);
    console.log("Pinned:: ", !pinned);
  };
  const handleViewClick = () => {
    console.log("View Item Clicked");
    setViewItem(!viewItem);
    console.log("Viewed Item:: ", !viewItem);
  };
  const onMouseHoverItem = () => {
    setHoverItem(true);
  };
  const onMouseLeaveItem = () => {
    setHoverItem(false);
  };
  // eslint-disable-next-line no-console
  console.log(" Pending Review Presenter :::");
  return (
    <>
      <StyledListItem
        style={open || hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        button
        onClick={handleClick}
        onMouseEnter={onMouseHoverItem}
        onMouseLeave={onMouseLeaveItem}
      >
        {open ? (
          <CollapseIcon className={classes.icon} />
        ) : (
          <ExpandIcon className={classes.icon} />
        )}
        <ListItemIcon className={classes.listItemIcon}>
          <PendingReviewIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <React.Fragment>
              <Grid container={true}>
                <Grid item={true} md={12} sm={12}>
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
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                  >
                    {title}&nbsp;
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyStatus}
                    color="textSecondary"
                  >
                    {!hoverItem && !open && (
                      <NormalStyleChip
                        size="small"
                        color="primary"
                        icon={<InReviewWhiteIcon />}
                        label={status}
                      />
                    )}
                    {(hoverItem || open) && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<InReviewIcon />}
                        label={status}
                      />
                    )}
                    &nbsp;
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                  >
                    {verbose}
                  </Typography>
                </Grid>
                <Grid item={true} md={12} sm={12}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                  >
                    {approvers.join(",")}
                  </Typography>
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
          }
        />
        {!open && hoverItem && (
          <div>
            <PinIcon onClick={handlePinClick} />
          </div>
        )}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense disablePadding className={classes.collapsedList}>
          <StyledListItem button className={classes.nested}>
            <IconButton aria-label="listIcon">
              <PendingReviewItemIcon />
            </IconButton>
            <ListItemText
              id={id}
              primary={
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  {
                    "1. SI-02053 . Rev 1 - Micro - Hematocrit Capillary Test Tube"
                  }
                </Typography>
              }
            />
            <div>
              <ViewIcon onClick={handleViewClick} />
            </div>
          </StyledListItem>
          <StyledListItem button className={classes.nested}>
            <IconButton aria-label="listIcon">
              <PendingReviewItemIcon />
            </IconButton>
            <ListItemText
              id={id}
              primary={
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  {"2. SI-02060 . Rev 2A - 100-1000µL Pipette Tip"}
                </Typography>
              }
            />
            <div>
              <ViewIcon onClick={handleViewClick} />
            </div>
          </StyledListItem>
          <StyledListItem button className={classes.nested}>
            <IconButton aria-label="listIcon">
              <PendingReviewItemIcon />
            </IconButton>
            <ListItemText
              id={id}
              primary={
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  {"3. SI-02062 . Rev 1 - 5mL Pipette Tip"}
                </Typography>
              }
            />
            <div>
              <ViewIcon onClick={handleViewClick} />
            </div>
          </StyledListItem>
          <StyledListItem button className={classes.nested}>
            <IconButton aria-label="listIcon">
              <PendingReviewItemIcon />
            </IconButton>
            <ListItemText
              id={id}
              className={classes.typography}
              primary={
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  {
                    "4. SI-02066 . Rev B - 304 Stainless Steel Ball, 1/8 Diameter"
                  }{" "}
                </Typography>
              }
            />
            <div>
              <ViewIcon onClick={handleViewClick} />
            </div>
          </StyledListItem>
        </List>
      </Collapse>
    </>
  );
};

export default PendingReviewPresenter;
