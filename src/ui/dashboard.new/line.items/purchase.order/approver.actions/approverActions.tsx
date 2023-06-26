import { Avatar, Box, Collapse, Grid, Link, List, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ReactComponent as ApprovedIcon } from '../../../../../assets/images/approved_status.svg';
import { ReactComponent as ApprovedWhiteIcon } from '../../../../../assets/images/approved_status_white.svg';
import { ReactComponent as AttachmentIcon } from '../../../../../assets/images/attachment.svg';
import { ReactComponent as CollapseIcon } from '../../../../../assets/images/collapse.svg';
import { ReactComponent as DownloadPdfIcon } from '../../../../../assets/images/download_pdf.svg';
import { ReactComponent as ExpandIcon } from '../../../../../assets/images/expand.svg';
import { ReactComponent as PinIcon } from '../../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../../assets/images/pin_solid.svg';
import { ReactComponent as RejectSolidIcon } from '../../../../../assets/images/reject_status.svg';
import { ReactComponent as RejectIcon } from '../../../../../assets/images/reject_status_solid.svg';
import { attachmentsActions } from '../../../../../state/ducks/attachments';
import { AttachmentDownloadResponse } from '../../../../../state/ducks/attachments/types';
import { Nullable } from '../../../../../state/ducks/common/types';
import { ActionTypes, STATUS_TYPES_LABEL } from '../../../../../state/ducks/dashboard.new/my.feeds/types';
import { Attachment } from '../../../../change.request/form/types';
import { getInitalsFromName } from '../../../../components/icons/avatar/helpers';
import Text from '../../../../components/Text';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { DialogHandler } from '../../../../hooks/useDialog';
import Colors from '../../../../layout/theme/utils/colors';
import DocId from '../../common/DocId/presenter';
import DocTitle from '../../common/DocTitle/presenter';
import DownloadHtmlPreview from '../../common/DownloadHtmlPreview';
import { HoverStyleChip } from '../../common/HoverStyleChipApprovalApproved';
import { HoverStyleChip as RejectedHoverStyleChip } from '../../common/HoverStyleChipApprovalRejected';
import { NormalStyleChip } from '../../common/NormalStyleChipApprovalApproved';
import { NormalStyleChip as RejectedNormalStyleChip } from '../../common/NormalStyleChipApprovalRejected';
import { StyledListItem } from '../../common/StyledListItem';
import { StyleTooltip } from '../../common/StyleTooltip';
import { formatCurrency } from '../../common/Utils';
import useStyles from './approverActions.styles';
import DismissAction from '../../common/DismissAction';

interface Props {
  id: string
  docDocumentId: string
  docId: string
  docRevId: string
  type: string
  docRevName: string
  docRevVersion: string
  purchaseOrderSupplierDocRevId: string
  purchaseOrderSupplierDocId: string
  status: string
  timestamp: string
  purchaseOrderAttachments?:
  | {
    name: string
    type: string
    id: string
  }[]
  purchaseOrdeLineItemCount?: number
  purchaseOrderDescription?: string
  purchaseOrderCurrency?: string
  purchaseOrderTotalAmount?: string
  purchaseSupplierName?: string
  approverName: string
  approvalId: string
  approverAvatar: Nullable<string>
  approverInitialColor: string
  hoverItemId: string
  onMouseHoverItem: (id: string) => void
  pinned: boolean
  pinLineItem?: (id: string) => void
  unPinLineItem?: (id: string) => void
  dialogPDF: DialogHandler
  dismissLineItem?: (id: string) => void
}
const ApproverActionItemPresenter: React.FC<Props> = ({
  id,
  docDocumentId,
  docId,
  docRevId,
  status,
  docRevName,
  docRevVersion,
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
  pinned,
  pinLineItem,
  unPinLineItem,
  dialogPDF,
  dismissLineItem,
}) => {
  const classes = useStyles();
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
      rtext: `${purchaseOrderCurrency} ${
        purchaseOrderTotalAmount && formatCurrency(purchaseOrderTotalAmount)
      }`,
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
  const [pinHover, setPinHover] = React.useState(false);
  const [downloadPdfHover, setDownloadPdfHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const downloadAction = useActionCreator(attachmentsActions.download);
  const hoverItem = hoverItemId === id;
  const handleClick = () => {
    setOpen(!open);
  };
  const handleDismiss = () => {
    dismissLineItem?.(id);
  };
  const handlePinClick = () => {
    pinLineItem?.(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem?.(id);
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
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, '_blank');
    },
  });
  const downloadAttachment = (attachment: Attachment) => () => {
    async.start(downloadAction, attachment, async);
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
        {type === ActionTypes.DIRECT_PO_APPROVAL_REQ_OWNER_APPROVER_APPROVED
        && open ? (
            <CollapseIcon className={classes.icon} data-cy="collapse-icon" onClick={handleClick} />
          ) : (
            <ExpandIcon className={classes.icon}  data-cy="expand-icon" onClick={handleClick} />
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
              <Grid container={true} wrap="nowrap" alignItems="center">
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
                {STATUS_TYPES_LABEL.APPROVED !== status
                  && STATUS_TYPES_LABEL.REJECTED !== status && (
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
                  <DocId
                    url={docId ? documentVersionPath(docRevId || '', docDocumentId) : '#' }
                    docId={docId}
                  />
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
                <Grid item={true} className={classes.grayDot} />
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
        {isUnpinShown && (
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
                            purchaseOrderSupplierDocId,
                          )
                          : ''
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
    </>
  );
};

export default ApproverActionItemPresenter;
