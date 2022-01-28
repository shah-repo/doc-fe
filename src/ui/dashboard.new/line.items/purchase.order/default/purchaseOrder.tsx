import {
  Collapse,
  Grid,
  Link,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ApprovedIcon } from "../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as AttachmentIcon } from "../../../../../assets/images/attachment.svg";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as POIcon } from "../../../../../assets/images/PO.svg";
import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../../state/ducks/attachments/types";
import { STATUS_TYPES_LABEL } from "../../../../../state/ducks/dashboard.new/my.feeds/types";
import { Attachment } from "../../../../change.request/form/types";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import Colors from "../../../../layout/theme/utils/colors";
import { HoverStyleChip } from "../../common/HoverStyleChipApprovalApproved";
import { NormalStyleChip } from "../../common/NormalStyleChipApprovalApproved";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import { formatCurrency } from "../../common/Utils";
import { styles } from "./purchaseOrder.styles";

interface Props {
  id: string;
  docDocumentId: string;
  docId: string;
  docRevId?: string;
  type: string;
  pinned: boolean;
  docRevName: string;
  purchaseOrderSupplierDocRevId: string;
  purchaseOrderSupplierDocId: string;
  status: string;
  timestamp: string;
  purchaseOrderAttachments: {
    name: string;
    type: string;
    id: string;
  }[];
  purchaseOrdeLineItemCount: number;
  purchaseOrderDescription: string;
  purchaseOrderCurrency: string;
  purchaseOrderTotalAmount: string;
  purchaseSupplierName: string;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
}
const PurchaseOrderItemPresenter: React.FunctionComponent<Props> = ({
  id,
  docDocumentId,
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
  pinned,
  onMouseHoverItem,
  unPinLineItem,
  pinLineItem,
}) => {
  const classes = styles();
  const PoItems: any = [
    {
      id: "id1",
      isSupplier: true,
      ltext: "Supplier:",
      rtext: purchaseSupplierName,
    },
    {
      id: "id2",
      isRegular: true,
      ltext: "Total:",
      rtext: `${purchaseOrderCurrency} ${formatCurrency(
        purchaseOrderTotalAmount
      )}`,
    },
    {
      id: "id3",
      isRegular: true,
      ltext: "Description:",
      rtext: purchaseOrderDescription,
    },
    {
      id: "id4",
      isRegular: true,
      ltext: "Line Items:",
      rtext: purchaseOrdeLineItemCount,
    },
    {
      id: "id5",
      isAttachments: true,
      ltext: "Attachments",
      rtext: purchaseOrderAttachments || [],
    },
  ];
  const [pinHover, setPinHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const downloadAction = useActionCreator(attachmentsActions.download);
  const hoverItem = hoverItemId === id;
  const handleClick = () => {
    setOpen(!open);
  };
  const handlePinClick = () => {
    pinLineItem(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem(id);
  };
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseLeavePinIcon = () => {
    setPinHover(false);
  };
  const onMouseHoverListItem = () => {
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
        onMouseEnter={onMouseHoverListItem}
        className={classes.listItem}
      >
        {open ? (
          <CollapseIcon className={classes.icon} onClick={handleClick} />
        ) : (
          <ExpandIcon className={classes.icon} onClick={handleClick} />
        )}
        <ListItemIcon>
          <POIcon height={30} width={30} />
        </ListItemIcon>
        <ListItemText
          primary={
            <>
              <Grid container={true} wrap="nowrap">
                <Grid item={true}>
                  <Link
                    href={
                      docId
                        ? documentVersionPath(docRevId || "", docDocumentId)
                        : "#"
                    }
                    color="inherit"
                    className={classes.link}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      className={`${classes.typography} ${classes.margin5}`}
                      color="textPrimary"
                      noWrap
                    >
                      {docId}
                    </Typography>
                  </Link>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <StyleTooltip title={docRevName} placement="top" arrow>
                    <Link
                      href={
                        docRevName
                          ? documentVersionPath(docRevId || "", docDocumentId)
                          : "#"
                      }
                      color="inherit"
                      className={classes.link}
                    >
                      <Typography
                        component="span"
                        variant="caption"
                        className={`${classes.typographyBold} ${classes.margin5}`}
                        color="textSecondary"
                        noWrap
                      >
                        {docRevName}
                      </Typography>
                    </Link>
                  </StyleTooltip>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text translation="common.is" />
                  </Typography>
                </Grid>
                {STATUS_TYPES_LABEL[status] && (
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
                )}
                {!STATUS_TYPES_LABEL[status] && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.typographyStatus}
                      color="textSecondary"
                      noWrap
                    >
                      {status}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.grayDot}></Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.timestampContainer}
                    color="textSecondary"
                    noWrap
                  >
                    {timestamp}
                  </Typography>
                </Grid>
              </Grid>
            </>
          }
        />
        {hoverItem && !pinned && (
          <div className={classes.actionIcons}>
            {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
            {pinHover && (
              <StyleTooltip
                title={<Text translation="common.pin" />}
                placement="top"
                arrow
              >
                <PinSolidIcon
                  onClick={handlePinClick}
                  onMouseLeave={onMouseLeavePinIcon}
                />
              </StyleTooltip>
            )}
          </div>
        )}
        {pinned && (
          <StyleTooltip
            title={<Text translation="common.unpin" />}
            placement="top"
            arrow
          >
            <PinSolidIcon onClick={handleUnPinClick} />
          </StyleTooltip>
        )}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding className={classes.collapsedList}>
          {PoItems.map((poItem, index) => {
            if (poItem.isSupplier) {
              return (
                <StyledListItem
                  key={index}
                  button
                  className={classes.nested}
                  disableRipple
                >
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
                        href={
                          poItem.rtext
                            ? documentVersionPath(
                              purchaseOrderSupplierDocRevId || "",
                              purchaseOrderSupplierDocId
                            )
                            : "#"
                        }
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
                <StyledListItem
                  key={index}
                  button
                  className={classes.nested}
                  disableRipple
                >
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
                <StyledListItem
                  key={index}
                  button
                  className={classes.nested}
                  disableRipple
                >
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
