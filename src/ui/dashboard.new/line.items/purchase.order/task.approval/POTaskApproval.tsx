/* eslint-disable react-hooks/rules-of-hooks */
import {
  Avatar,
  Box,
  Collapse,
  Grid,
  Link,
  List,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ApproveIcon } from "../../../../../assets/images/approve.svg";
import { ReactComponent as ApproveSolidIcon } from "../../../../../assets/images/approve_solid.svg";
import { ReactComponent as AttachmentIcon } from "../../../../../assets/images/attachment.svg";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as RejectIcon } from "../../../../../assets/images/reject.svg";
import { ReactComponent as RejectSolidIcon } from "../../../../../assets/images/reject_solid.svg";
import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../../state/ducks/attachments/types";
import { ChangeRequestTransitionResponse } from "../../../../../state/ducks/changeRequest/types";
import { Nullable } from "../../../../../state/ducks/common/types";
import { Attachment } from "../../../../change.request/form/types";
import { getInitalsFromName } from "../../../../components/icons/avatar/helpers";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import useDialog from "../../../../hooks/useDialog";
import Colors from "../../../../layout/theme/utils/colors";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import { formatCurrency } from "../../common/Utils";
import ApproveDialogueContainer from "./POApprovalDialogContainer";
import { styles } from "./taskApproval.styles";

interface Props {
  id: string;
  docDocumentId: string;
  type: string;
  docId: string;
  docRevId: string;
  approvalId: string;
  timestamp: string;
  docRevOwnerAvatar: Nullable<string>;
  docRevOwnerInitialColor: string;
  docRevOwnerName: string;
  docRevName: string;
  purchaseOrderSupplierDocRevId: string;
  purchaseOrderSupplierDocId: string;
  purchaseOrderCurrency: string;
  purchaseSupplierName: string;
  purchaseOrderTotalAmount: string;
  purchaseOrderDescription: string;
  purchaseOrdeLineItemCount: string;
  purchaseOrderAttachments: {
    name: string;
    type: string;
    id: string;
  }[];
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pinned: boolean;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
}
const taskApprovalPresenter: React.FunctionComponent<Props> = ({
  id,
  docDocumentId,
  docId,
  approvalId,
  docRevId,
  docRevOwnerName,
  timestamp,
  docRevName,
  docRevOwnerAvatar,
  docRevOwnerInitialColor,
  purchaseOrderCurrency,
  purchaseSupplierName,
  purchaseOrderSupplierDocRevId,
  purchaseOrderSupplierDocId,
  purchaseOrderTotalAmount,
  purchaseOrderDescription,
  purchaseOrdeLineItemCount,
  purchaseOrderAttachments,
  hoverItemId,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
}) => {
  const classes = styles();
  const [pinHover, setPinHover] = React.useState(false);
  const [approveHover, setApproveHover] = React.useState(false);
  const [rejectHover, setRejectHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [approved, setApproved] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);
  const hoverItem = hoverItemId === id;
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
  const handlePinClick = () => {
    pinLineItem(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem(id);
  };
  const handleApproveClick = () => {
    openApproveDialog();
    setApproved(!approved);
  };
  const handleRejectClick = () => {
    openRejectDialog();
    setRejected(!rejected);
  };
  const onMouseLeaveActionIcons = () => {
    setApproveHover(false);
    setRejectHover(false);
    setPinHover(false);
  };
  const onMouseHoverPinIcon = () => {
    setApproveHover(false);
    setRejectHover(false);
    setPinHover(true);
  };
  const onMouseHoverApproveIcon = () => {
    setPinHover(false);
    setRejectHover(false);
    setApproveHover(true);
  };
  const onMouseHoverRejectIcon = () => {
    setPinHover(false);
    setApproveHover(false);
    setRejectHover(true);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const transitionDialog = useDialog();
  const transitionDialog1 = useDialog();
  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      transitionDialog.close();
    },
    onError: (error) => {
      transitionDialog.close();
    },
  });
  const openApproveDialog = () => {
    async.reset();
    transitionDialog.open();
  };
  const openRejectDialog = () => {
    async.reset();
    transitionDialog1.open();
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const downloadAction = useActionCreator(attachmentsActions.download);
  const downloadAsync = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, "_blank");
    },
  });
  const downloadAttachment = (attachment: Attachment) => () => {
    downloadAsync.start(downloadAction, attachment, downloadAsync);
  };
  return (
    <>
      <StyledListItem
        style={open || hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        className={classes.listItem}
        button
        onMouseEnter={onMouseHoverListItem}
      >
        {open ? (
          <CollapseIcon className={classes.icon} onClick={handleClick} />
        ) : (
          <ExpandIcon className={classes.icon} onClick={handleClick} />
        )}
        <ListItemAvatar>
          {docRevOwnerAvatar ? (
            <Avatar
              style={{ backgroundColor: `${docRevOwnerInitialColor}` }}
              className={classes.avatar}
              alt={docRevOwnerName}
              src={docRevOwnerAvatar}
            />
          ) : (
            <Avatar
              style={{ backgroundColor: `${docRevOwnerInitialColor}` }}
              className={classes.avatar}
            >
              {getInitalsFromName(docRevOwnerName)}
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyBold} ${classes.margin5}`}
                    color="textSecondary"
                    noWrap
                  >
                    {docRevOwnerName}
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text translation="require.approval" />
                  </Typography>
                </Grid>
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
                        className={classes.typographyBold}
                        color="textSecondary"
                        noWrap
                      >
                        {docRevName}
                      </Typography>
                    </Link>
                  </StyleTooltip>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.grayDot}></Grid>
                <Grid item={true} md={12} sm={12}>
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
        {hoverItem && (
          <Box
            component="div"
            className={classes.actionIcons}
            onMouseLeave={onMouseLeaveActionIcons}
          >
            <span>
              {!rejectHover && (
                <RejectIcon
                  data-cy="transition-reject"
                  onMouseEnter={onMouseHoverRejectIcon}
                />
              )}
              {rejectHover && (
                <StyleTooltip
                  title={<Text translation="common.reject" />}
                  placement="top"
                  arrow
                >
                  <RejectSolidIcon
                    data-cy="transition-reject"
                    onClick={handleRejectClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                  />
                </StyleTooltip>
              )}
            </span>
            <span className={classes.actionIcon}>
              {!approveHover && (
                <ApproveIcon
                  data-cy="transition-approve"
                  onMouseEnter={onMouseHoverApproveIcon}
                />
              )}
              {approveHover && (
                <StyleTooltip
                  title={<Text translation="common.approve" />}
                  placement="top"
                  arrow
                >
                  <ApproveSolidIcon
                    data-cy="transition-approve"
                    onClick={handleApproveClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                  />
                </StyleTooltip>
              )}
            </span>
            <span className={classes.actionIcon}>
              {!pinHover && !pinned && (
                <PinIcon onMouseEnter={onMouseHoverPinIcon} />
              )}
              {pinHover && !pinned && (
                <StyleTooltip
                  title={<Text translation="common.pin" />}
                  placement="top"
                  arrow
                >
                  <PinSolidIcon
                    onClick={handlePinClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                  />
                </StyleTooltip>
              )}
              {pinned && (
                <StyleTooltip
                  title={<Text translation="common.unpin" />}
                  placement="top"
                  arrow
                >
                  <PinSolidIcon
                    onClick={handleUnPinClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                  />
                </StyleTooltip>
              )}
            </span>
          </Box>
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
                              purchaseOrderSupplierDocId || ""
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
      <ApproveDialogueContainer
        transition="reject"
        type="reject"
        approvalId={approvalId}
        transitionDialog={transitionDialog1}
        label="transition.action.reject"
      />
      <ApproveDialogueContainer
        transition="approve"
        approvalId={approvalId}
        transitionDialog={transitionDialog}
        label="transition.action.approve"
      />
    </>
  );
};

export default taskApprovalPresenter;
