import {
  Avatar,
  Collapse,
  Grid,
  Link,
  List,
  ListItemAvatar,
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
import { ReactComponent as RejectSolidIcon } from "../../../../../assets/images/reject_status.svg";
import { ReactComponent as RejectIcon } from "../../../../../assets/images/reject_status_solid.svg";
import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../../state/ducks/attachments/types";
import { Nullable } from "../../../../../state/ducks/common/types";
import {
  ActionTypes,
  STATUS_TYPES_LABEL,
} from "../../../../../state/ducks/dashboard.new/my.feeds/types";
import { Attachment } from "../../../../change.request/form/types";
import { getInitalsFromName } from "../../../../components/icons/avatar/helpers";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import Colors from "../../../../layout/theme/utils/colors";
import { HoverStyleChip } from "../../common/HoverStyleChipApprovalApproved";
import { HoverStyleChip as RejectedHoverStyleChip } from "../../common/HoverStyleChipApprovalRejected";
import { NormalStyleChip } from "../../common/NormalStyleChipApprovalApproved";
import { NormalStyleChip as RejectedNormalStyleChip } from "../../common/NormalStyleChipApprovalRejected";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import { styles } from "./approverActions.styles";

interface Props {
  id: string;
  docDocumentId: string;
  docId: string;
  docRevId?: string;
  type: string;
  docRevName: string;
  purchaseOrderSupplierDocRevId: string;
  purchaseOrderSupplierDocId: string;
  status: string;
  timestamp: string;
  purchaseOrderAttachments?:
  | {
    name: string;
    type: string;
    id: string;
  }[];
  purchaseOrdeLineItemCount?: number;
  purchaseOrderDescription?: string;
  purchaseOrderCurrency?: string;
  purchaseOrderTotalAmount?: string;
  purchaseSupplierName?: string;
  approverName: string;
  approvalId: string;
  approverAvatar: Nullable<string>;
  approverInitialColor: string;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pins: any;
  pinLineItem: (id: string) => void;
  unPinLineItem: (pinnedItemId: string) => void;
}
const ApproverActionItemPresenter: React.FunctionComponent<Props> = ({
  id,
  docDocumentId,
  docId,
  docRevId,
  status,
  docRevName,
  approverName,
  approvalId,
  approverAvatar,
  approverInitialColor,
  purchaseOrderSupplierDocRevId,
  purchaseOrderSupplierDocId,
  timestamp,
  hoverItemId,
  type,
  purchaseOrderCurrency,
  purchaseSupplierName,
  purchaseOrderTotalAmount,
  purchaseOrderDescription,
  purchaseOrdeLineItemCount,
  purchaseOrderAttachments,
  onMouseHoverItem,
  pins,
  pinLineItem,
  unPinLineItem,
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
      rtext: `${purchaseOrderCurrency} ${purchaseOrderTotalAmount}`,
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
  // const [pinned, setPinned] = React.useState(false);
  const pinned = pins && pins.length > 0;
  const downloadAction = useActionCreator(attachmentsActions.download);
  const hoverItem = hoverItemId === id;
  const handleClick = () => {
    setOpen(!open);
  };
  const handlePinClick = () => {
    pinLineItem(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem(pins[0].pinnedItemId);
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
        {type === ActionTypes.DIRECT_PO_APPROVAL_REQ_OWNER_APPROVER_APPROVED &&
        open ? (
            <CollapseIcon className={classes.icon} onClick={handleClick} />
          ) : (
            <ExpandIcon className={classes.icon} onClick={handleClick} />
          )}
        <ListItemAvatar>
          {approverAvatar ? (
            <Avatar
              style={{ backgroundColor: `${approverInitialColor}` }}
              className={classes.avatar}
              alt={approverName}
              src={approverAvatar}
            />
          ) : (
            <Avatar
              style={{ backgroundColor: `${approverInitialColor}` }}
              className={classes.avatar}
            >
              {getInitalsFromName(approverName)}
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Grid container={true} wrap="nowrap">
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyBold} ${classes.margin5}`}
                    color="textSecondary"
                    noWrap
                  >
                    {approverName}
                  </Typography>
                </Grid>
                {STATUS_TYPES_LABEL.REJECTED === status && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyStatus} ${classes.margin5}`}
                      color="textSecondary"
                      noWrap
                    >
                      {!hoverItem && (
                        <RejectedNormalStyleChip
                          size="small"
                          color="primary"
                          icon={<RejectIcon data-cy="transition-reject" />}
                          label={STATUS_TYPES_LABEL[status]}
                        />
                      )}
                      {hoverItem && (
                        <RejectedHoverStyleChip
                          color="primary"
                          size="small"
                          icon={<RejectSolidIcon data-cy="transition-reject" />}
                          label={STATUS_TYPES_LABEL[status]}
                        />
                      )}
                    </Typography>
                  </Grid>
                )}
                {STATUS_TYPES_LABEL.APPROVED === status && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyStatus} ${classes.margin5}`}
                      color="textSecondary"
                      noWrap
                    >
                      {!hoverItem && !open && (
                        <NormalStyleChip
                          size="small"
                          color="primary"
                          icon={<ApprovedIcon data-cy="transition-approve" />}
                          label={STATUS_TYPES_LABEL[status]}
                        />
                      )}
                      {(hoverItem || open) && (
                        <HoverStyleChip
                          color="primary"
                          size="small"
                          icon={
                            <ApprovedWhiteIcon data-cy="transition-approve" />
                          }
                          label={STATUS_TYPES_LABEL[status]}
                        />
                      )}
                    </Typography>
                  </Grid>
                )}
                {STATUS_TYPES_LABEL.APPROVED !== status &&
                  STATUS_TYPES_LABEL.REJECTED !== status && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyStatus} ${classes.margin5}`}
                      color="textSecondary"
                      noWrap
                    >
                      {status}
                    </Typography>
                  </Grid>
                )}
                {/* <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text translation="common.your" />
                  </Typography>
                </Grid> */}
                <Grid item={true}>
                  <Link
                    href={docId ? documentVersionPath(docRevId || "", docDocumentId) : "#"}
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
                {/* {docRevName && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.typography}
                      color="textPrimary"
                      noWrap
                    >
                      <Text translation="common.to" />
                    </Typography>
                  </Grid>
                )} */}
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={docRevName ? documentVersionPath(docRevId || "", docDocumentId) : "#"}
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
                </Grid>
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
        {!open && hoverItem && !pinned && (
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
        {pinned && !open && (
          <StyleTooltip title="Un Pin item" placement="top" arrow>
            <PinSolidIcon
              onClick={handleUnPinClick}
            />
          </StyleTooltip>
        )}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding className={classes.collapsedList}>
          {PoItems.map((poItem, index) => {
            if (poItem.isSupplier) {
              return (
                <StyledListItem key={index} button className={classes.nested} disableRipple>
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
                            : ""
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
                <StyledListItem key={index} button className={classes.nested} disableRipple>
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
                <StyledListItem key={index} button className={classes.nested} disableRipple>
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

export default ApproverActionItemPresenter;
