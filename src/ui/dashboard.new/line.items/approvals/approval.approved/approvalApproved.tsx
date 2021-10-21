/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as CloseIcon } from "../../../../../assets/images/close.svg";
import { ReactComponent as ApprovedIcon } from "../../../../../assets/images/myfeed_approved.svg";
import { ReactComponent as PendingReviewIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./approvalApproved.styles";

interface Props {
  id: string;
  type: string;
  title: string;
  documentId: string;
  status: string;
  timestamp: string;
  verbose: string;
  approvers: string[];
}
const approvalChangePresenter: React.FunctionComponent<Props> = ({
  id,
  status,
  title,
  timestamp,
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
      color: Colors.latest_green_varient,
    },
  })(Chip);

  const HoverStyleChip = withStyles({
    root: {
      backgroundColor: Colors.latest_green_varient,
      borderRadius: "3px",
    },
    colorPrimary: {
      color: Colors.white,
    },
  })(Chip);

  const [pinned, setPinned] = React.useState(false);
  const [closed, setClosed] = React.useState(false);
  const [hoverItem, setHoverItem] = React.useState(false);
  const handlePinClick = () => {
    console.log("Pin Clicked");
    setPinned(!pinned);
    console.log("Pinned:: ", !pinned);
  };
  const handleCloseClick = () => {
    console.log("Close Clicked");
    setClosed(!closed);
    console.log("Closed:: ", !closed);
  };
  const onMouseHoverItem = () => {
    setHoverItem(true);
  };
  const onMouseLeaveItem = () => {
    setHoverItem(false);
  };
  // eslint-disable-next-line no-console
  console.log("approvalChangePresenter");
  return (
    <StyledListItem
      button
      onMouseEnter={onMouseHoverItem}
      onMouseLeave={onMouseLeaveItem}
    >
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
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  is&nbsp;
                </Typography>
                <Typography
                  component="span"
                  variant="caption"
                  className={classes.typographyStatus}
                  color="textSecondary"
                >
                  {!hoverItem && (
                    <NormalStyleChip
                      size="small"
                      color="primary"
                      icon={<ApprovedIcon />}
                      label={status}
                    />
                  )}
                  {hoverItem && (
                    <HoverStyleChip
                      color="primary"
                      size="small"
                      icon={<ApprovedWhiteIcon />}
                      label={status}
                    />
                  )}
                </Typography>
              </Grid>
            </Grid>
            <Grid container={true}>
              <Grid item={true} md={12} sm={12}>
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
      {hoverItem && (
        <div className={classes.actionIcons}>
          <span>
            <CloseIcon onClick={handleCloseClick} />
          </span>
          <span className={classes.actionIcon}>
            <PinIcon onClick={handlePinClick} />
          </span>
        </div>
      )}
    </StyledListItem>
  );
};

export default approvalChangePresenter;
