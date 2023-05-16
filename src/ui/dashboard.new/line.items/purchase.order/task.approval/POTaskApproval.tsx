import { Avatar, Box, Collapse, Grid, Link, List, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ReactComponent as ApproveIcon } from '../../../../../assets/images/approve.svg';
import { ReactComponent as ApproveSolidIcon } from '../../../../../assets/images/approve_solid.svg';
import { ReactComponent as AttachmentIcon } from '../../../../../assets/images/attachment.svg';
import { ReactComponent as CollapseIcon } from '../../../../../assets/images/collapse.svg';
import { ReactComponent as DownloadPdfIcon } from '../../../../../assets/images/download_pdf.svg';
import { ReactComponent as ExpandIcon } from '../../../../../assets/images/expand.svg';
import { ReactComponent as PinIcon } from '../../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../../assets/images/pin_solid.svg';
import { ReactComponent as RejectIcon } from '../../../../../assets/images/reject.svg';
import { ReactComponent as RejectSolidIcon } from '../../../../../assets/images/reject_solid.svg';
import { attachmentsActions } from '../../../../../state/ducks/attachments';
import { AttachmentDownloadResponse } from '../../../../../state/ducks/attachments/types';
import { ChangeRequestTransitionResponse } from '../../../../../state/ducks/changeRequest/types';
import { Nullable } from '../../../../../state/ducks/common/types';
import { Attachment } from '../../../../change.request/form/types';
import { getInitalsFromName } from '../../../../components/icons/avatar/helpers';
import Text from '../../../../components/Text';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog, { DialogHandler } from '../../../../hooks/useDialog';
import Colors from '../../../../layout/theme/utils/colors';
import DocId from '../../common/DocId/presenter';
import DocTitle from '../../common/DocTitle/presenter';
import DownloadHtmlPreview from '../../common/DownloadHtmlPreview';
import { StyledListItem } from '../../common/StyledListItem';
import { StyleTooltip } from '../../common/StyleTooltip';
import { formatCurrency } from '../../common/Utils';
import ApproveDialogueContainer from './POApprovalDialogContainer';
import useStyles from './taskApproval.styles';
import DismissAction from '../../common/DismissAction';

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
  docRevVersion: string;
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
  pinLineItem?: (id: string) => void;
  unPinLineItem?: (id: string) => void;
  dialogPDF: DialogHandler;
  dismissLineItem?: (id: string) => void;
}
const TaskApprovalPresenter: React.FC<Props> = ({
  id,
  docDocumentId,
  docId,
  approvalId,
  docRevId,
  docRevOwnerName,
  timestamp,
  docRevName,
  docRevVersion,
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
  dialogPDF,
  dismissLineItem,
}) => {
  const classes = useStyles();
  const [pinHover, setPinHover] = React.useState(false);
  const [approveHover, setApproveHover] = React.useState(false);
  const [rejectHover, setRejectHover] = React.useState(false);
  const [downloadPdfHover, setDownloadPdfHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [approved, setApproved] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const PoItems: any = [
    {
      id: 'id1',
      isSupplier: true,
      ltext: 'Supplier:',
      rtext: purchaseSupplierName,
    },
    {
      id: 'id2',
      isRegular: true,
      ltext: 'Total:',
      rtext: `${purchaseOrderCurrency} ${formatCurrency(
        purchaseOrderTotalAmount
      )}`,
    },
    {
      id: 'id3',
      isRegular: true,
      ltext: 'Description:',
      rtext: purchaseOrderDescription,
    },
    {
      id: 'id4',
      isRegular: true,
      ltext: 'Line Items:',
      rtext: purchaseOrdeLineItemCount,
    },
    {
      id: 'id5',
      isAttachments: true,
      ltext: 'Attachments',
      rtext: purchaseOrderAttachments || [],
    },
  ];
  const handleDismiss = () => {
    dismissLineItem?.(id);
  };
  const handlePinClick = () => {
    pinLineItem?.(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem?.(id);
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
    setDownloadPdfHover(false);
    setApproveHover(false);
    setRejectHover(false);
    setPinHover(false);
  };
  const onMouseHoverPinIcon = () => {
    setDownloadPdfHover(false);
    setApproveHover(false);
    setRejectHover(false);
    setPinHover(true);
  };
  const onMouseHoverApproveIcon = () => {
    setDownloadPdfHover(false);
    setPinHover(false);
    setRejectHover(false);
    setApproveHover(true);
  };
  const onMouseHoverRejectIcon = () => {
    setDownloadPdfHover(false);
    setPinHover(false);
    setApproveHover(false);
    setRejectHover(true);
  };
  const onMouseHoverDownloadPdfIcon = () => {
    setPinHover(false);
    setApproveHover(false);
    setRejectHover(false);
    setDownloadPdfHover(true);
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
      downloadInfo && window.open(downloadInfo.url, '_blank');
    },
  });
  const downloadAttachment = (attachment: Attachment) => () => {
    downloadAsync.start(downloadAction, attachment, downloadAsync);
  };

  const isPinShown = pinLineItem && !pinned;
  const isUnpinShown = unPinLineItem && pinned;

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
          <CollapseIcon className={classes.icon} data-cy="collapse-icon" onClick={handleClick}  />
        ) : (
          <ExpandIcon className={classes.icon}  data-cy="expand-icon" onClick={handleClick}  />
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
                  <DocId
                    url={docId ? documentVersionPath(docRevId || '', docDocumentId) : '#'}
                    docId={docId}
                  />
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <DocTitle
                    url={docRevId ? documentVersionPath(docRevId || '', docDocumentId) : '#'}
                    docRevVersion={docRevVersion}
                    docRevName={docRevName}
                  />
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
            className={`${classes.actionIcons} ${classes.poActionIconsWidth}`}
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
                <span onMouseLeave={onMouseLeaveActionIcons} className={classes.cursorPointer}>
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
              {!rejectHover && (
                <RejectIcon
                  data-cy="transition-reject"
                  onMouseEnter={onMouseHoverRejectIcon}
                  className={classes.cursorPointer}
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
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              )}
            </span>
            <span className={classes.actionIcon}>
              {!approveHover && (
                <ApproveIcon
                  data-cy="transition-approve"
                  onMouseEnter={onMouseHoverApproveIcon}
                  className={classes.cursorPointer}
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
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              )}
            </span>
            <span className={classes.actionIcon}>
              {!pinHover && isPinShown && (
                <PinIcon
                  data-cy="pin-icon"
                  onMouseEnter={onMouseHoverPinIcon}
                  className={classes.cursorPointer}
                />
              )}
              {pinHover && isPinShown && (
                <StyleTooltip
                  title={<Text translation="common.pin" />}
                  placement="top"
                  arrow
                >
                  <PinSolidIcon
                    data-cy="pin-solid-icon"
                    onClick={handlePinClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              )}
              {isUnpinShown && (
                <StyleTooltip
                  title={<Text translation="common.unpin" />}
                  placement="top"
                  arrow
                >
                  <PinSolidIcon
                    data-cy="pin-solid-icon"
                    onClick={handleUnPinClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                    className={classes.cursorPointer}
                  />
                </StyleTooltip>
              )}
            </span>
            {dismissLineItem && (
              <DismissAction classes={classes} onClick={handleDismiss} />
            )}
          </Box>
        )}
        {pinned && (
          <span className={classes.actionIcon}>
            <StyleTooltip
              title={<Text translation="common.unpin" />}
              placement="top"
              arrow
            >
              <PinSolidIcon
                data-cy="pin-solid-icon"
                onClick={handleUnPinClick}
                className={classes.cursorPointer}
              />
            </StyleTooltip>
          </span>
        )}
        {hoverItem && dismissLineItem && (
          <DismissAction classes={classes} onClick={handleDismiss} />
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
                            purchaseOrderSupplierDocRevId || '',
                            purchaseOrderSupplierDocId || ''
                          )
                          : '#'
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

export default TaskApprovalPresenter;
