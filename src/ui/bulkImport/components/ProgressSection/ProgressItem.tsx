import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Divider,
  Typography,
} from '@material-ui/core';
import { History } from 'history';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { MomentFormats } from '../../../../common/utils/date';
import { deleteBulkImport, getReportsExcelFile, setBulkImport, setBulkImportsStatus, setCurrentStep } from '../../../../state/ducks/bulkImport/actions';
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
  const deleteBulkImportAction = useActionCreator(deleteBulkImport);
  const currentApproval = item?.documentRevision?.approvals.find(
    approval => approval.status === ApprovalStatus.Pending && approval.approverId === currentEmployeeId,
  );
  const transitionDialog = useDialog();
  const transitionDialog1 = useDialog();
  const showApproverButtons = currentApproval?.approverId && currentApproval?.approverId === currentEmployeeId && _.isEmpty(item.process) && item.status === BkStatus.STARTED;
  const showApprovals = !!currentApproval && showApproverButtons;
  const currentProgressStep = useRef(0);
  const isRejected = STATUSES_CANCELED.includes(item?.status as BkStatus);
  const showDeleteButton = _.isEmpty(item.process) && !STATUSES_HIDE_DELETE.includes(item?.status as BkStatus);
  const showButtonView = ((!isRejected && currentProgressStep.current > 0 && !item?.completedAt) || (item?.reports) || item.status === BkStatus.CANCELLED);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
    setOpenDeleteDialog(true);
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteClick = () => {
    asyncDeleteBk.start(deleteBulkImportAction, { bulkImportId: item.id }, asyncDeleteBk);
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
      if (!_.isEmpty(item.process) || item.status === BkStatus.IN_PROGRESS) {
        currentProgressStep.current = 5; // importing step
      } else if (currentProgressStep.current === 5) {
        currentProgressStep.current = 4; // approver step
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
              {item.status === BkStatus.CANCELLED ? translate('common.rejected') : translate('common.failed')} {rejectedDate && item.status === BkStatus.CANCELLED ? `(${moment(rejectedDate).format(MomentFormats.FullDateTime)})` : null}
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
          {showButtonView && <Button className={_.isEmpty(item?.reports) || item.status === BkStatus.CANCELLED ? classes.viewButton : classes.downloadLogs} kind="outlined" color={!_.isEmpty(item?.reports) ? 'primary' : 'inherit'} onClick={_.isEmpty(item?.reports) ? handleReturnToStep : handleDownloadFile}>
            <Text translation={_.isEmpty(item?.reports) || item.status === BkStatus.CANCELLED ? 'bulkImport.progress.view' : 'bulkImport.progress.downloadLogs' } />
          </Button>}
          {_.isEmpty(item?.reports) && <Box width={29}>
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
      <DeleteDialog open={openDeleteDialog} handleClose={handleCloseDelete} handleConfirm={handleDeleteClick} />
    </React.Fragment>
  );
};

export default ProgressItem;
