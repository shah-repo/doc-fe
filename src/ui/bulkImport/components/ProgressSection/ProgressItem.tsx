import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from '@material-ui/core';
import { History } from 'history';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { MomentFormats } from '../../../../common/utils/date';
import { getReportsExcelFile, setBulkImport, setCurrentStep } from '../../../../state/ducks/bulkImport/actions';
import { getBulkImportsGroupByProcess } from '../../../../state/ducks/bulkImport/selectors';
import { BkStatus, BulkImportCustom } from '../../../../state/ducks/bulkImport/types';
import { ChangeRequestTransitionResponse } from '../../../../state/ducks/changeRequest/types';
import { ApprovalStatus } from '../../../../state/ducks/common/types';
import Text from '../../../components/Text';
import { Button } from '../../../components/forms/fields-next';
import { BULK_IMPORT_URL } from '../../../constants/urls';
import { StyleTooltip } from '../../../dashboard.new/line.items/common/StyleTooltip';
import ApproveDialogueContainer from '../../../dashboard.new/line.items/purchase.order/task.approval/POApprovalDialogContainer';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import ProgressIcons, { iconStatuses } from './ProgressIcons';
import useStyles, { CustomLinearProgress } from './styles';

interface ProgressItemProps {
  item: BulkImportCustom
  idx: number
  valKey: string
  currentEmployeeId: string
}

const ProgressItem: React.FC<ProgressItemProps> = ({ item, idx, valKey, currentEmployeeId }) => {
  const classes = useStyles();
  const history = useHistory() as History;
  const dispatch = useDispatch();
  const bulkImportsGroupByProcess = useSelector(getBulkImportsGroupByProcess);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const approvalId = item?.documentRevision?.approvals[0]?.id;
  const approverId = item?.documentRevision?.approvals[0]?.approverId;
  const transitionDialog = useDialog();
  const transitionDialog1 = useDialog();
  const showApproverButtons = approvalId && approverId === currentEmployeeId;
  const showApprovals = item?.documentRevision?.approvals[0]?.status === ApprovalStatus.Pending && showApproverButtons;
  const currentProgressStep = useRef(0);
  const isRejected = item?.status === BkStatus.CANCELLED;
  const showButtonView = (!isRejected && !showApproverButtons && currentProgressStep.current > 0 && !item?.completedAt) || (item?.reports && item?.completedAt);
  let rejectedDate;

  if (item?.documentRevision?.approvals?.length) {
    rejectedDate = item?.documentRevision?.approvals.find(approval => approval.status === ApprovalStatus.Rejected)?.updatedAt;
  }

  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      transitionDialog.close();
    },
    onError: () => {
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

  const handleApproveClick = () => {
    openApproveDialog();
  };

  const handleRejectClick = () => {
    openRejectDialog();
  };

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleDownloadFile = () => {
    dispatch(getReportsExcelFile(item.id));
  };

  const handleConfirmYes = () => {
    setConfirmOpen(false);
    dispatch(setBulkImport(item));
    dispatch(setCurrentStep(currentProgressStep.current));
    history.push(BULK_IMPORT_URL);
  };

  useEffect(() => {
    if (item?.icons) {
      const firstBlankIcon = item.icons.find(icon => (!iconStatuses[icon.icon] || icon.icon === 'blank'));
      if (firstBlankIcon) {
        currentProgressStep.current = firstBlankIcon.step;
      }
    }
  }, [item]);

  return (
    <React.Fragment key={idx}>
      <Box className={classes.itemContainer}>
        <Box className={classes.titleContainer}>
          {isRejected ? <FontAwesomeIcon
            className={classes.xmarkRedIcon}
            icon={solid('circle-xmark')}
          /> : item.completedAt ? <FontAwesomeIcon
            className={classes.checkGreenIcon}
            icon={solid('circle-check')}
          /> : <FontAwesomeIcon
            className={classes.watchLaterIcon}
            icon={solid('clock-three')}
          />}
          <Typography className={classes.itemTitle}>
            {item.jobId}
          </Typography>
        </Box>
        <Box className={classes.progressBarIconsContainer}>
          {isRejected ? <Box className={classes.completedMsgContainer}>
            <FontAwesomeIcon
              className={classes.xmarkRedIcon}
              icon={solid('circle-xmark')}
            />
            <Typography className={classes.completedText}>
              {translate('common.rejected')} {rejectedDate ? `(${moment(rejectedDate).format(MomentFormats.FullDateTime)})` : null}
            </Typography>
          </Box> : item?.completedAt ? (
            <Box className={classes.completedMsgContainer}>
              <FontAwesomeIcon
                className={classes.checkGreenIcon}
                icon={solid('circle-check')}
              />
              <Typography className={classes.completedText}>
                {translate('common.completed')} ({moment(item.completedAt).format(MomentFormats.FullDateTime)})
              </Typography>
            </Box>
          ) : (
            <>
              <ProgressIcons item={item} />
              <Box className={classes.progressBarContainer}>
                <Typography className={classes.progressBarTitle}>
                  {translate('common.importingFiles')}
                </Typography>
                <CustomLinearProgress variant="determinate" value={item.progress} className={classes.progressBar} />
                <Typography className={classes.progressBarText}>
                  {`${item.progress}% completed`}
                </Typography>
              </Box>
            </>
          )}
        </Box>
        <Box className={classes.viewModalContainer}>
          {showApprovals && <Box className={classes.approvalsContainer}>
            <StyleTooltip
              title={<Text translation="common.reject" />}
              placement="top"
              arrow
            >
              <FontAwesomeIcon
                data-cy="transition-reject"
                onClick={handleRejectClick}
                className={classes.rejectIcon}
                icon={regular('xmark-to-slot')}
              />
            </StyleTooltip>
            <StyleTooltip
              title={<Text translation="common.approve" />}
              placement="top"
              arrow
            >
              <FontAwesomeIcon
                data-cy="transition-approve"
                onClick={handleApproveClick}
                className={classes.approveIcon}
                icon={regular('check-to-slot')}
              />
            </StyleTooltip>
          </Box>}
          {showButtonView && <Button className={!item?.completedAt ? classes.viewButton : classes.downloadLogs} kind="outlined" color={item?.completedAt ? 'primary' : 'inherit'} onClick={!item?.completedAt ? handleConfirmOpen : handleDownloadFile}>
            <Text translation={!item?.completedAt ? 'bulkImport.progress.view' : 'bulkImport.progress.downloadLogs' } />
          </Button>}
        </Box>
      </Box>
      {idx !== bulkImportsGroupByProcess[valKey].length - 1 && <Divider className={classes.divider} />}
      {showApproverButtons
        && <>
          <ApproveDialogueContainer
            transition="reject"
            type="reject"
            approvalId={approvalId}
            transitionDialog={transitionDialog1}
            label="transition.action.reject"
            translationRejectMsg="bulkImport.reject.alert"
          />
          <ApproveDialogueContainer
            transition="approve"
            approvalId={approvalId}
            transitionDialog={transitionDialog}
            label="transition.action.approve"
          />
        </>
      }
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {translate('bulkImport.goBackStep')}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ marginRight: 10 }}>
          <Button onClick={handleConfirmClose} color="primary">
            {translate('common.false')}
          </Button>
          <Button onClick={handleConfirmYes} color="primary" autoFocus>
            {translate('common.true')}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ProgressItem;
