import {
  Chip,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as AttachmentIcon } from "../../../../../assets/images/attachment.svg";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as POIcon } from "../../../../../assets/images/po.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../../assets/images/warning_status_white.svg";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./purchaseOrder.styles";

interface Props {
  id: string;
  docId: string;
  type: string;
  docRevName: string;
  purchaseOrderSupplierDocRevId: string;
  purchaseOrderSupplierDocId: string;
  status: string;
  timestamp: string;
  docRevPendingApprovals: any[];
  docRevApprovedApprovals: any[];
  purchaseOrderAttachments: any[];
  purchaseOrdeLineItemCount: number;
  purchaseOrderDescription: string;
  purchaseOrderCurrency: string;
  purchaseOrderTotalAmount: string;
  purchaseSupplierName: string;
  hoverItemId: string;
  onMouseHoverItem: (arId: string | undefined) => void;
}
const PurchaseOrderItemPresenter: React.FunctionComponent<Props> = ({
  id,
  docId,
  status,
  docRevName,
  timestamp,
  hoverItemId,
  purchaseOrderCurrency,
  purchaseSupplierName,
  purchaseOrderTotalAmount,
  purchaseOrderDescription,
  purchaseOrdeLineItemCount,
  purchaseOrderAttachments,
  docRevPendingApprovals,
  docRevApprovedApprovals,
  onMouseHoverItem,
}) => {
  const classes = styles();

  const PoItems: any = [
    {
      id: "Id1",
      isSupplier: true,
      ltext: "Supplier:",
      rtext: purchaseSupplierName,
    },
    {
      id: "Id2",
      isRegular: true,
      ltext: "Total:",
      rtext: purchaseOrderCurrency + purchaseOrderTotalAmount,
    },
    {
      id: "Id3",
      isRegular: true,
      ltext: "Description:",
      rtext: purchaseOrderDescription,
    },
    {
      id: "Id4",
      isRegular: true,
      ltext: "Line Items:",
      rtext: purchaseOrdeLineItemCount,
    },
    { id: "Id5", isAttachments: true, ltext: "Attachments" },
  ];

  const attachments = purchaseOrderAttachments || [
    { id: "AT-1", name: "Attached File.pdf" },
    { id: "AT-3", name: "Document.doc" },
    { id: "AT-3", name: "Spreadsheet.xls" },
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
  const hoverItem = hoverItemId === id;
  const handleClick = () => {
    setOpen(!open);
  };
  const handlePinClick = () => {
    setPinned(!pinned);
  };
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseLeavePinIcon = () => {
    setPinHover(false);
  };
  // eslint-disable-next-line no-console
  console.log("PO Presenter :::");
  const onMouseHoverItemListItem = () => {
    onMouseHoverItem(id);
  };
  return (
    <>
      <StyledListItem
        style={open || hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        button
        onMouseEnter={onMouseHoverItemListItem}
        className={classes.listItem}
      >
        {open ? (
          <CollapseIcon className={classes.icon} onClick={handleClick} />
        ) : (
          <ExpandIcon className={classes.icon} onClick={handleClick} />
        )}
        <ListItemIcon>
          <POIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <React.Fragment>
              <Grid container={true} wrap="nowrap">
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    {docId}&nbsp;
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    to&nbsp;
                  </Typography>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                    noWrap
                  >
                    {docRevName || "NOT AVAILABLE"}&nbsp;
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    is&nbsp;
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyStatus}
                    color="textSecondary"
                    noWrap
                  >
                    {!hoverItem && !open && (
                      <NormalStyleChip
                        size="small"
                        color="primary"
                        icon={<WarningIcon />}
                        label={status}
                      />
                    )}
                    {(hoverItem || open) && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<WarningWhiteIcon />}
                        label={status}
                      />
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.grayDot}>
                  &nbsp;
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.timestampContainer}
                    color="textSecondary"
                    noWrap
                  >
                    &nbsp; {timestamp}
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
        <List disablePadding className={classes.collapsedList}>
          {PoItems.map((poItem) => {
            if (poItem.isSupplier) {
              return (
                <StyledListItem button className={classes.nested} disableRipple>
                  <Grid container className={classes.gridContainer}>
                    <Grid item md={3} sm={6}>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.typographyChildrenBold}
                        color="textPrimary"
                      >
                        <b>{poItem.ltext}</b>
                      </Typography>
                    </Grid>
                    <Grid item md={9} sm={6}>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.linkText}
                        color="textPrimary"
                      >
                        {poItem.rtext}
                      </Typography>
                    </Grid>
                  </Grid>
                </StyledListItem>
              );
            }
            if (poItem.isRegular) {
              return (
                <StyledListItem button className={classes.nested} disableRipple>
                  <Grid container className={classes.gridContainer}>
                    <Grid item md={3} sm={6}>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.typographyChildrenBold}
                        color="textPrimary"
                      >
                        <b>{poItem.ltext}</b>
                      </Typography>
                    </Grid>
                    <Grid item md={9} sm={6}>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.typography}
                        color="textPrimary"
                      >
                        {poItem.rtext}
                      </Typography>
                    </Grid>
                  </Grid>
                </StyledListItem>
              );
            }
            if (poItem.isAttachments) {
              return (
                <StyledListItem button className={classes.nested} disableRipple>
                  <Grid container className={classes.gridContainer}>
                    <Grid item md={3} sm={6}>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.typographyChildrenBold}
                        color="textPrimary"
                      >
                        <b>{poItem.ltext}</b>
                      </Typography>
                    </Grid>
                    <Grid item md={9} sm={6}>
                      <Grid
                        container
                        justify="space-between"
                        alignContent="center"
                      >
                        {attachments.map((attachmentInfo, index) => (
                          <Grid item key={index}>
                            <AttachmentIcon />{" "}
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.linkText}
                              color="textPrimary"
                            >
                              {" "}
                              {attachmentInfo.name}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </StyledListItem>
              );
            }
          })}
        </List>
      </Collapse>
    </>
  );
};

export default PurchaseOrderItemPresenter;
