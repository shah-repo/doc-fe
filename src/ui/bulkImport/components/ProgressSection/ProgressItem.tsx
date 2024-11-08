import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Divider,
  Typography,
} from '@material-ui/core';
import { History } from 'history';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { MomentFormats } from '../../../../common/utils/date';
import { deleteBulkImportSuccess, getReportsExcelFile, patchBulkImport, setBulkImport, setBulkImportsStatus, setCurrentStep } from '../../../../state/ducks/bulkImport/actions';
import { getBulkImportsGroupByProcess } from '../../../../state/ducks/bulkImport/selectors';
import { BkStatus, BulkImportCustom } from '../../../../state/ducks/bulkImport/types';
import { ChangeRequestTransitionResponse } from '../../../../state/ducks/changeRequest/types';
import { ApprovalStatus } from '../../../../state/ducks/common/types';
import Text from '../../../components/Text';
import { Button } from '../../../components/forms/fields-next';
import { BULK_IMPORT_URL } from '../../../constants/urls';
import { StyleTooltip } from '../../../dashboard.new/line.items/common/StyleTooltip';
import ApproveDialogueContainer from '../../../dashboard.new/line.items/purchase.order/task.approval/POApprovalDialogContainer';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import DeleteDialog from '../Dialogs/DeleteDialog';
import ProgressIcons, { iconStatuses } from './ProgressIcons';
import useStyles, { CustomLinearProgress } from './styles';

interface ProgressItemProps {
  item: BulkImportCustom
  idx: number
  valKey: string
  currentEmployeeId: string
}

const STATUSES_HIDE_DELETE = [BkStatus.IN_PROGRESS, BkStatus.COMPLETED, BkStatus.SUCCESS, BkStatus.CANCELLED];
const STATUSES_CANCELED = [BkStatus.CANCELLED, BkStatus.FAILED];

const ProgressItem: React.FC<ProgressItemProps> = ({ item, idx, valKey, currentEmployeeId }) => {
  const classes = useStyles();
  const history = useHistory() as History;
  const dispatch = useDispatch();
  const bulkImportsGroupByProcess = useSelector(getBulkImportsGroupByProcess);
  const deleteBulkImportAction = useActionCreator(patchBulkImport);
  const currentApproval = item?.documentRevision?.approvals.find(
    approval => approval.status === ApprovalStatus.Pending && approval.approverId === currentEmployeeId,
  );
  const transitionDialog = useDialog();
  const transitionDialog1 = useDialog();
  const isProcessEmpty = isEmpty(item.process?.process);
  const isReportEmpty = isEmpty(item?.reports);
  const showApproverButtons = currentApproval?.approverId && currentApproval?.approverId === currentEmployeeId && isProcessEmpty && item.status === BkStatus.STARTED;
  const showApprovals = !!currentApproval && showApproverButtons;
  const currentProgressStep = useRef(0);
  const isRejected = STATUSES_CANCELED.includes(item?.status as BkStatus);
  const showDeleteButton = isProcessEmpty && !STATUSES_HIDE_DELETE.includes(item?.status as BkStatus);
  const showButtonView = ((!isRejected && currentProgressStep.current > 0 && !item?.completedAt) || (item?.reports) || item.status === BkStatus.CANCELLED);
  const openDeleteDialog = useDialog();

  const async = useAsync<ChangeRequestTransitionResponse>({
    onSuccess: () => {
      transitionDialog.close();
    },
    onError: () => {
      transitionDialog.close();
    },
  });
  const asyncDeleteBk = useAsync({
    onSuccess: () => {
      handleCloseDelete();
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

  const handleOpenDetele = () => {
    openDeleteDialog.open();
  };
  const handleCloseDelete = () => {
    openDeleteDialog.close();
  };

  const afterDeleteBk = (bulkImportId: string) => {
    dispatch(deleteBulkImportSuccess(bulkImportId));
  };

  const handleDeleteClick = () => {
    asyncDeleteBk.start(deleteBulkImportAction, { bulkImportId: item.id, data: { status: BkStatus.DELETED }, callback: afterDeleteBk }, asyncDeleteBk);
  };

  const handleDownloadFile = () => {
    dispatch(getReportsExcelFile(item.id, item.jobId));
  };

  const handleReturnToStep = () => {
    dispatch(setBulkImport(item));
    // if the process is not empty is because is importing
    dispatch(setCurrentStep(currentProgressStep.current));
    history.push(BULK_IMPORT_URL);
  };

  const handleRejectedBulkImport = () => {
    dispatch(setBulkImportsStatus(item.id, BkStatus.CANCELLED));
  };

  const handleApproveBulkImport = () => {
    dispatch(setBulkImportsStatus(item.id, BkStatus.IN_PROGRESS));
  };

  useEffect(() => {
    if (item?.icons) {
      const firstBlankIcon = item.icons.find(icon => (!iconStatuses[icon.icon] || icon.icon === 'blank'));
      if (firstBlankIcon) {
        currentProgressStep.current = firstBlankIcon.step;
      }
      if ((item?.documentRevision?.approvals
        && item.documentRevision.approvals.some(approval => approval.status === ApprovalStatus.Pending)
        && item.documentRevision.approvals.some(approval => approval.status !== ApprovalStatus.Approved))) {
        // if we don't find any blank icon is because we already finish and is on the last step
        currentProgressStep.current = 4; // approver step
      }
      if (!isProcessEmpty || item.status === BkStatus.IN_PROGRESS) {
        currentProgressStep.current = 5; // importing step
      } else if (currentProgressStep.current === 5) {
        currentProgressStep.current = 4; // approver step
      }
    }
  }, [item]);

  return (
    <React.Fragment key={idx}>
      <Box className={classes.itemContainer}>
        <Box>
          <Box className={classes.titleContainer}>
            {item.completedAt ? <FontAwesomeIcon
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
          {isRejected && (
            <Box className={classes.itemErrorMessage}>
              <Typography className={classes.itemErrorMessageText}>
                {translate('bulkImport.approval.rejected.error')}
              </Typography>
            </Box>
          )}
        </Box>
        <Box className={classes.progressBarIconsContainer}>
          {item?.completedAt ? (
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
              {!isRejected && <Box className={classes.progressBarContainer}>
                <Typography className={classes.progressBarTitle}>
                  {translate('common.importingFiles')}
                </Typography>
                <CustomLinearProgress variant="determinate" value={item.progress} className={classes.progressBar} />
                <Typography className={classes.progressBarText}>
                  {`${item.progress}% completed`}
                </Typography>
              </Box>}
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
          {showButtonView && <Button className={isReportEmpty || item.status === BkStatus.CANCELLED ? classes.viewButton : classes.downloadLogs} kind="outlined" color={!isReportEmpty ? 'primary' : 'inherit'} onClick={isReportEmpty ? handleReturnToStep : handleDownloadFile}>
            <Text translation={isReportEmpty || item.status === BkStatus.CANCELLED ? 'bulkImport.progress.view' : 'bulkImport.progress.downloadLogs' } />
          </Button>}
          {isReportEmpty && <Box width={29}>
            {showDeleteButton && <StyleTooltip
              title={<Text translation="bulkImport.delete" />}
              placement="top"
              arrow
            >
              <FontAwesomeIcon
                onClick={handleOpenDetele}
                className={classes.deleteIcon}
                icon={regular('trash-can')}
              />
            </StyleTooltip>}
          </Box>}
        </Box>
      </Box>
      {idx !== bulkImportsGroupByProcess[valKey].length - 1 && <Divider className={classes.divider} />}
      {showApproverButtons
        && <>
          <ApproveDialogueContainer
            transition="reject"
            type="reject"
            approvalId={currentApproval?.id}
            transitionDialog={transitionDialog1}
            label="transition.action.reject"
            translationRejectMsg="bulkImport.reject.alert"
            onSuccess={handleRejectedBulkImport}
          />
          <ApproveDialogueContainer
            transition="approve"
            approvalId={currentApproval?.id}
            transitionDialog={transitionDialog}
            label="transition.action.approve"
            onSuccess={handleApproveBulkImport}
          />
        </>
      }
      <DeleteDialog handler={openDeleteDialog} handleClose={handleCloseDelete} handleConfirm={handleDeleteClick} />
    </React.Fragment>
  );
};

export default ProgressItem;
