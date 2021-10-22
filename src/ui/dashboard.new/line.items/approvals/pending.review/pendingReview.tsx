/* eslint-disable no-console */
import {
  Chip,
  Collapse,
  Grid, IconButton, List, ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as InReviewWhiteIcon } from "../../../../../assets/images/in_review_status.svg";
import { ReactComponent as InReviewIcon } from "../../../../../assets/images/in_review_status_white.svg";
import { ReactComponent as PendingReviewIcon } from "../../../../../assets/images/pending_approval.svg";
import { ReactComponent as PendingReviewItemIcon } from "../../../../../assets/images/pending_review_nested.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
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

  const PrListItems = [{
    id: "id1",
    text: "1. SI-02053 . Rev 1 - Micro - Hematocrit Capillary Test Tube",
  },
  {
    id: "id2",
    text: "2. SI-02060 . Rev 2A - 100-1000µL Pipette Tip",
  },
  {
    id: "id3",
    text: "3. SI-02062 . Rev 1 - 5mL Pipette Tip",
  },
  {
    id: "id4",
    text: "4. SI-02066 . Rev B - 304 Stainless Steel Ball, 1/8 Diameter",
  },
  ];

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

  const StyleTooltip = withStyles({
    arrow: {
      color: Colors.black,
    },
    tooltip: {
      backgroundColor: Colors.black,
    },
    tooltipPlacementTop: {
      margin: "8px 0",
    },
  })(Tooltip);

  const [pinHover, setPinHover] = React.useState(false);
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
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseLeavePinIcon = () => {
    setPinHover(false);
  };
  const openApproversModel = (e) => {
    e.stopPropagation();
    console.log("Please open Model popup here");
  };

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
                    style={hoverItem ? { textDecoration: "underline" } : {}}
                    onClick={openApproversModel}
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
          <div className={classes.actionIcons}>
            {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
            {pinHover && (
              <StyleTooltip title="Pin item" placement="top" arrow>
                <PinSolidIcon
                  onClick={handlePinClick}
                  onMouseLeave={onMouseLeavePinIcon}
                />
              </StyleTooltip>
            )}
          </div>
        )}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense disablePadding className={classes.collapsedList}>
          {PrListItems.map((prItem, index) => <StyledListItem button className={classes.nested} key={index}>
            <IconButton aria-label="listIcon">
              <PendingReviewItemIcon />
            </IconButton>
            <ListItemText
              id={prItem.id}
              primary={
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  {
                    prItem.text
                  }
                </Typography>
              }
            />
            <div>
              <ViewIcon onClick={handleViewClick} />
            </div>
          </StyledListItem>)}
        </List>
      </Collapse>
    </>
  );
};

export default PendingReviewPresenter;
