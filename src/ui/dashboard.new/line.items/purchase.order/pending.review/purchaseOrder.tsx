import { Box, Collapse, Grid, Link, List, ListItemIcon, ListItemText, Modal, Typography } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as AttachmentIcon } from "../../../../../assets/images/attachment.svg";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/collapse.svg";
import { ReactComponent as DownloadPdfIcon } from "../../../../../assets/images/download_pdf.svg";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/expand.svg";
import { ReactComponent as InReviewIcon } from "../../../../../assets/images/in_review_status.svg";
import { ReactComponent as InReviewWhiteIcon } from "../../../../../assets/images/in_review_status_white.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as POIcon } from "../../../../../assets/images/PO.svg";
import { attachmentsActions } from "../../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../../state/ducks/attachments/types";
import { Nullable } from "../../../../../state/ducks/common/types";
import { dashboardMyFeedsActions } from "../../../../../state/ducks/dashboard.new/my.feeds";
import { MY_FEEDS_INITIAL_PAYLOAD } from "../../../../../state/ducks/dashboard.new/my.feeds/constants";
import { Attachment } from "../../../../change.request/form/types";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import { DialogHandler } from "../../../../hooks/useDialog";
import Colors from "../../../../layout/theme/utils/colors";
import { getStatusLabel } from "../../common/DocIcon";
import DocId from "../../common/DocId/presenter";
import DocTitle from "../../common/DocTitle/presenter";
import DownloadHtmlPreview from "../../common/DownloadHtmlPreview";
import { HoverStyleChip } from "../../common/HoverStyleChipPendingReview";
import { NormalStyleChip } from "../../common/NormalStyleChipPendingReview";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import { formatCurrency, getPendingTooltipText } from "../../common/Utils";
import EmailModal from "../../dialogs/email/EmailDialog";
import useStyles from "./purchaseOrder.styles";

interface Props {
  id: string;
  docDocumentId: string;
  docId: string;
  docRevId: string;
  type: string;
  docRevName: string;
  docRevVersion: string;
  purchaseOrderSupplierDocRevId: string;
  purchaseOrderSupplierDocId: string;
  status: string;
  displaystatus: string;
  docTypeGroup: string;
  timestamp: string;
  docRevPendingApprovals: {
    userName: string;
    employeeId: string;
    userAvatar: Nullable<string>;
    userInitialColor: string;
    approvalStatus: string;
  }[];
  docRevApprovedApprovals: {
    userName: string;
    employeeId: string;
    userAvatar: Nullable<string>;
    userInitialColor: string;
    approvalStatus: string;
  }[];
  purchaseOrderAttachments: {
    name: string;
    type: string;
    id: string;
  }[];
  purchaseOrdeLineItemCount: number;
  purchaseOrderDescription: string;
  pinned: boolean;
  purchaseOrderCurrency: string;
  purchaseOrderTotalAmount: string;
  purchaseSupplierName: string;
  hoverItemId: string;
  pendingEmailSentAt: Nullable<string>;
  onMouseHoverItem: (id: string) => void;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
  dialogPDF: DialogHandler;
}
const PurchaseOrderItemPresenter: React.FC<Props> = ({
  id,
  docDocumentId,
  docId,
  docRevId,
  status,
  docRevName,
  docRevVersion,
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
  pinned,
  displaystatus,
  docTypeGroup,
  onMouseHoverItem,
  pinLineItem,
  unPinLineItem,
  pendingEmailSentAt,
  dialogPDF,
}) => {
  const classes = useStyles();

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
  const dispatch = useDispatch();
  const [pinHover, setPinHover] = React.useState(false);
  const [downloadPdfHover, setDownloadPdfHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [emailModelopen, setEmailModelopen] = React.useState(false);
  const [lastEmailSent, setLastEmailSent] = React.useState(false);
  const downloadAction = useActionCreator(attachmentsActions.download);
  const hoverItem = hoverItemId === id;
  const { count, pending, approved, primaryText, secondaryText } =
    getPendingTooltipText(docRevPendingApprovals, docRevApprovedApprovals);
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
    setDownloadPdfHover(false);
    setPinHover(true);
  };
  const onMouseLeaveActionIcons = () => {
    setPinHover(false);
    setDownloadPdfHover(false);
  };
  const onMouseHoverDownloadPdfIcon = () => {
    setPinHover(false);
    setDownloadPdfHover(true);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const openApproversModel = (e) => {
    e.stopPropagation();
    setLastEmailSent(false);
    setEmailModelopen(true);
  };
  const handleEmailModelClose = () => {
    setEmailModelopen(false);
  };
  const onClose = () => {
    handleEmailModelClose();
    if (lastEmailSent) {
      dispatch(dashboardMyFeedsActions.loadMyFeedsList(MY_FEEDS_INITIAL_PAYLOAD));
    }
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
        button
        divider
        disableRipple
        className={classes.listItem}
        style={open || hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        onMouseEnter={onMouseHoverListItem}
      >
        {open ? (
          <CollapseIcon className={classes.icon} data-cy="collapse-icon" onClick={handleClick} />
        ) : (
          <ExpandIcon className={classes.icon}  data-cy="expand-icon" onClick={handleClick} />
        )}
        <ListItemIcon>
          <POIcon height={30} width={30} />
        </ListItemIcon>
        <ListItemText
          primary={
            <>
              <Grid container={true} wrap="nowrap" alignItems="center" data-cy={docId + "InReview"}>
                <Grid item={true}>
                  <DocId url={documentVersionPath(docRevId || "", docDocumentId)} docId={docId} />
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <DocTitle
                    url={documentVersionPath(docRevId || "", docDocumentId)}
                    docRevVersion={docRevVersion}
                    docRevName={docRevName}
                  />
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
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyStatus} ${classes.margin7}`}
                    color="textSecondary"
                    noWrap
                    onClick={openApproversModel}
                  >
                    {!hoverItem && !open && (
                      <NormalStyleChip
                        size="small"
                        color="primary"
                        icon={<InReviewIcon />}
                        label={getStatusLabel(docTypeGroup, status, displaystatus) }
                      />
                    )}
                    {(hoverItem || open) && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<InReviewWhiteIcon />}
                        label={getStatusLabel(docTypeGroup, status, displaystatus) }
                      />
                    )}
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
                    <Text translation="pending.approval" />
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid
                  zeroMinWidth
                  item={true}
                  className={`${classes.truncateText} ${classes.margin7}`}
                >
                  <StyleTooltip
                    title={
                      <>
                        <Text
                          translation={primaryText}
                          values={{ count }}
                        />
                        <br />
                        <Text
                          translation={secondaryText}
                          values={{
                            approved,
                            pending,
                          }}
                        />
                      </>
                    }
                    placement="top-start"
                    arrow
                    PopperProps={{ popperOptions: {} }}
                  >
                    <Link
                      href="#"
                      onClick={openApproversModel}
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
                        {docRevPendingApprovals !== undefined
                          ? docRevPendingApprovals
                            .map((approver) => approver.userName)
                            .join(", ")
                          : ""}
                      </Typography>
                    </Link>
                  </StyleTooltip>
                </Grid>
                <Grid
                  item={true}
                  className={`${classes.grayDot} ${classes.margin5}`}
                ></Grid>
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
        {hoverItem && (
          <Box
            component="div"
            className={classes.actionIcons}
            onMouseLeave={onMouseLeaveActionIcons}
          >
            {!downloadPdfHover && (
              <span>
                <DownloadPdfIcon
                  data-cy="transition-download-pdf"
                  onMouseEnter={onMouseHoverDownloadPdfIcon}
                  className={classes.cursorPointer}
                />
              </span>
            )}
            {
              <StyleTooltip
                title={<Text translation="common.download.pdf" />}
                placement="top"
                arrow
              >
                <span onMouseLeave={onMouseLeaveActionIcons}>
                  <DownloadHtmlPreview
                    id={docRevId}
                    data-cy="transition-download-pdf"
                    downloadPdfHover={downloadPdfHover}
                    dialogPDF={dialogPDF}
                  />
                </span>
              </StyleTooltip>
            }
            <span className={classes.actionIcon}>
              {!pinHover && !pinned && (
                <PinIcon onMouseEnter={onMouseHoverPinIcon} className={classes.cursorPointer} />
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
                    className={classes.cursorPointer}
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
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              )}
            </span>
          </Box>
        )}
        {pinned && (
          <span className={classes.actionIcon}>
            <StyleTooltip
              title={<Text translation="common.unpin" />}
              placement="top"
              arrow
            >
              <PinSolidIcon onClick={handleUnPinClick} className={classes.cursorPointer} />
            </StyleTooltip>
          </span>
        )}
      </StyledListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding className={classes.collapsedList}>
          {PoItems.map((poItem, index) => (
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
                  {poItem.isSupplier && (
                    <RouterLink
                      to={
                        poItem.rtext
                          ? documentVersionPath(
                            purchaseOrderSupplierDocRevId || "",
                            purchaseOrderSupplierDocId
                          )
                          : "#"
                      }
                      color="inherit"
                      className={classes.link}
                    >
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.linkText}
                        color="textPrimary"
                      >
                        {poItem.rtext}
                      </Typography>
                    </RouterLink>
                  )}
                  {poItem.isRegular && (
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.typography}
                      color="textPrimary"
                      dangerouslySetInnerHTML={{ __html: poItem.rtext }}
                    />
                  )}
                  {poItem.isAttachments && (
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
                  )}
                </Grid>
              </Grid>
            </StyledListItem>
          ))}
        </List>
      </Collapse>
      <Modal
        open={emailModelopen}
        onClose={onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <EmailModal
          id={id}
          handleEmailModelClose={onClose}
          pendingApprovers={docRevPendingApprovals}
          setLastEmailSent={setLastEmailSent}
          approvedApprovers={docRevApprovedApprovals}
          pendingEmailSentAt={pendingEmailSentAt}
        />
      </Modal>
    </>
  );
};

export default PurchaseOrderItemPresenter;
