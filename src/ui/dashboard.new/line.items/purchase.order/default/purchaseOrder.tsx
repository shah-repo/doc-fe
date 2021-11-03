import {
  Chip,
  Collapse,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ApprovedIcon } from "../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as AttachmentIcon } from "../../../../../assets/images/attachment.svg";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as POIcon } from "../../../../../assets/images/po.svg";
import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../../state/ducks/attachments/types";
import { STATUS_TYPES_LABEL } from "../../../../../state/ducks/dashboard.new/my.feeds/types";
import { Attachment } from "../../../../change.request/form/types";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./purchaseOrder.styles";

interface Props {
  id: string;
  docId: string;
  docRevId?: string | undefined;
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
  docRevId,
  status,
  docRevName,
  purchaseOrderSupplierDocRevId,
  purchaseOrderSupplierDocId,
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
    {
      id: "Id5",
      isAttachments: true,
      ltext: "Attachments",
      rtext: purchaseOrderAttachments || [],
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
  const downloadAction = useActionCreator(attachmentsActions.download);
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
  const onMouseHoverItemListItem = () => {
    onMouseHoverItem(id);
  };
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, "_blank");
    },
  });
  const downloadAttachment = (attachment: Attachment) => () => {
    async.start(downloadAction, attachment, async);
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
                  {/* TO DO:: Needs to uncomment once we get document revision id in the response */}
                  {/* <Link
                    href={documentVersionPath(docRevId || "", id)}
                    color="inherit"
                    className={classes.link}
                  > */}
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    {docId}
                  </Typography>
                  {/* </Link> */}
                  &nbsp;
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  {/* TO DO:: Needs to uncomment once we get document revision id in the response */}
                  {/* <Link
                    href={documentVersionPath(docRevId || "", id)}
                    color="inherit"
                    className={classes.link}
                  > */}
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                    noWrap
                  >
                    {docRevName}
                  </Typography>
                  {/* </Link> */}
                  &nbsp;
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
                        icon={<ApprovedIcon />}
                        label={STATUS_TYPES_LABEL[status]}
                      />
                    )}
                    {(hoverItem || open) && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<ApprovedWhiteIcon />}
                        label={STATUS_TYPES_LABEL[status]}
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
                    &nbsp;{timestamp}
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
                        variant="caption"
                        className={classes.typographyChildrenBold}
                        color="textSecondary"
                      >
                        {poItem.ltext}
                      </Typography>
                    </Grid>
                    <Grid item md={9} sm={6}>
                      <Link
                        href={documentVersionPath(
                          purchaseOrderSupplierDocRevId || "",
                          purchaseOrderSupplierDocId
                        )}
                        color="inherit"
                      >
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.linkText}
                          color="textPrimary"
                        >
                          {poItem.rtext}
                        </Typography>
                      </Link>
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
                        variant="caption"
                        className={classes.typographyChildrenBold}
                        color="textSecondary"
                      >
                        {poItem.ltext}
                      </Typography>
                    </Grid>
                    <Grid item md={9} sm={6}>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.typography}
                        color="textPrimary"
                        dangerouslySetInnerHTML={{ __html: poItem.rtext }}
                      />
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
                        variant="caption"
                        className={classes.typographyChildrenBold}
                        color="textSecondary"
                      >
                        {poItem.ltext}
                      </Typography>
                    </Grid>
                    <Grid item md={9} sm={6}>
                      <Grid
                        container
                        justify="space-between"
                        alignContent="center"
                      >
                        {poItem.rtext.map((attachmentInfo, index) => (
                          <Grid item key={index}>
                            <AttachmentIcon
                              className={classes.attachmentIcon}
                            />
                            <Link
                              href="#"
                              onClick={downloadAttachment(attachmentInfo)}
                              color="inherit"
                              className={classes.linkTextColor}
                            >
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.linkText}
                                color="textPrimary"
                              >
                                {` ${attachmentInfo.name}.${attachmentInfo.type}`}
                              </Typography>
                            </Link>
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
