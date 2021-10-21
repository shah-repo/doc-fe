/* eslint-disable no-console */
import { Collapse } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ReactComponent as ExpandIcon } from "../../../../assets/images/myfeed.expand.svg";
import { ReactComponent as MinizeIcon } from "../../../../assets/images/myfeed.mimimize.svg";
import { ReactComponent as PinIcon } from "../../../../assets/images/pin.svg";
import { ReactComponent as POIcon } from "../../../../assets/images/po.svg";
import { ReactComponent as WarningIcon } from "../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../assets/images/warning_status_white.svg";
import Colors from "../../../layout/theme/utils/colors";
import { styles } from "./purchaseOrder.styles";

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
const PurchaseOrderItemPresenter: React.FunctionComponent<Props> = ({
  id, status, title, verbose, timestamp,
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
      color: Colors.latest_yellow_varient,
    },
  })(Chip);

  const HoverStyleChip = withStyles({
    root: {
      backgroundColor: Colors.latest_yellow_varient,
      borderRadius: "3px",
    },
    colorPrimary: {
      color: Colors.white,
    },
  })(Chip);

  const [open, setOpen] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [hoverItem, setHoverItem] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const handlePinClick = () => {
    console.log("Pin Clicked");
    setPinned(!pinned);
    console.log("Pinned:: ", !pinned);
  };
  const onMouseHoverItem = () => {
    setHoverItem(true);
  };
  const onMouseLeaveItem = () => {
    setHoverItem(false);
  };
  // eslint-disable-next-line no-console
  console.log("PO Presenter :::");
  return (
    <>
      <StyledListItem button onClick={handleClick} onMouseEnter={onMouseHoverItem} onMouseLeave={onMouseLeaveItem}>
        {open ? <MinizeIcon className={classes.icon}/> : <ExpandIcon className={classes.icon}/>}
        <ListItemIcon className={classes.listItemIcon}>
          <POIcon />
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
                  className={classes.typography}
                  color="textPrimary"
                >
                  to&nbsp;
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
                  {!hoverItem &&
                  <NormalStyleChip size="small" color="primary" icon={<WarningIcon />}
                    label={status}/>}
                  {hoverItem && <HoverStyleChip color="primary" size="small" icon={<WarningWhiteIcon/>}
                    label={status}/>}
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
        { !open && hoverItem && <div className={classes.actionIcons}><PinIcon onClick={handlePinClick} /></div> }
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          <StyledListItem button className={classes.nested}>
            <Grid container className={classes.gridContainer}>
              <Grid item md={3} sm={6}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typographyChildrenBold}
                  color="textPrimary"
                >
                  <b>Supplier:</b>
                </Typography>
              </Grid>
              <Grid item md={9} sm={6}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  Quality Circuits
                </Typography>
              </Grid>
            </Grid>
          </StyledListItem>
          <StyledListItem button className={classes.nested}>
            <Grid container className={classes.gridContainer}>
              <Grid item md={3} sm={6}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typographyChildrenBold}
                  color="textPrimary"
                >
                  <b>Total:</b>
                </Typography>
              </Grid>
              <Grid item md={9} sm={6}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  USD $5,200.50
                </Typography>
              </Grid>
            </Grid>
          </StyledListItem>
          <StyledListItem button className={classes.nested}>
            <Grid container className={classes.gridContainer}>
              <Grid item md={3} sm={6}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typographyChildrenBold}
                  color="textPrimary"
                >
                  <b>Description:</b>
                </Typography>
              </Grid>
              <Grid item md={9} sm={6}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  Flex circuits for the balloon catheter
                </Typography>
              </Grid>
            </Grid>
          </StyledListItem>
          <StyledListItem button className={classes.nested}>
            <Grid container className={classes.gridContainer}>
              <Grid item md={3} sm={6}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typographyChildrenBold}
                  color="textPrimary"
                >
                  <b>Line Items:</b>
                </Typography>
              </Grid>
              <Grid item md={9} sm={6}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                >
                  05
                </Typography>
              </Grid>
            </Grid>
          </StyledListItem>
        </List>
      </Collapse>
    </>
  );
};

export default PurchaseOrderItemPresenter;
