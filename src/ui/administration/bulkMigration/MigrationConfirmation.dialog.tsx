import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { translate } from '../../../common/intl';
import { bulkMigrationActions } from '../../../state/ducks/bulk.migration';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { Button } from '../../components/forms/fields-next';
import { toastError, toastSuccess } from '../../components/notifications';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import DialogHeader from './DrawerHeader';
import { IApprovalRequirementGroup, IApprovalRequirements, ISelectedDetails } from './interface';
import useStyles from './styles';

interface MigrationConfirmationDialogProps {
  isOpen: boolean
  handleClose: () => void
  handleConfirmation: (selectedDetails: ISelectedDetails[], password: string) => void
  selectedDetails: ISelectedDetails[]
  toDocumentTypeId: string
  toFormRev?: DocumentRevision
}
const MigrationConfirmationDialog: React.FC<MigrationConfirmationDialogProps> = ({
  isOpen,
  handleClose,
  selectedDetails,
  handleConfirmation,
  toDocumentTypeId,
  toFormRev,
}) => {
  const classes = useStyles();
  const [toFormReleasedError, setToFormReleasedError] = useState<string>('');
  const employeePassword = useRef<string>('');
  const actionCountMap: { [key: string]: number } = {};
  const [approvalRequirements, setApprovalRequirements] = useState<IApprovalRequirements>();

  const fetchApprovalRequirements = useActionCreator(
    bulkMigrationActions.fetchApprovalRequirements,
  );
  const addUserToGroups = useActionCreator(
    bulkMigrationActions.addUserToGroups,
  );

  const approvalReqAsync = useAsync<IApprovalRequirements>({
    onSuccess: (approvalRequirements) => {
      setApprovalRequirements(approvalRequirements);
    },
    onError: toastError,
  });

  const addUserToGroupsAsync = useAsync<IApprovalRequirements>({
    onSuccess: (approvalRequirements) => {
      setApprovalRequirements(approvalRequirements);
      toastSuccess('Automation user has been added to the required groups successfully');
    },
    onError: toastError,
  });

  selectedDetails.forEach((detail: ISelectedDetails) => {
    if (!actionCountMap[detail.action]) {
      actionCountMap[detail.action] = 0;
    }
    actionCountMap[detail.action] += 1;
  });

  useEffect(() => {
    if (toDocumentTypeId) {
      approvalReqAsync.start(fetchApprovalRequirements, toDocumentTypeId, approvalReqAsync);
      isToFormRevReleased();
    }
  }, [toDocumentTypeId]);

  const handleEmployeeConfirmation = () => {
    handleClose();
    handleConfirmation(selectedDetails, employeePassword.current);
  };

  const setEmployeePassword = (empPassword: string) => {
    employeePassword.current = empPassword;
  };

  const onAddUserToGroup = () => {
    addUserToGroupsAsync.start(addUserToGroups, toDocumentTypeId, approvalRequirements, addUserToGroupsAsync);
  };

  const isApprovalRequirementFulfilled = (group: IApprovalRequirementGroup) => {
    return approvalRequirements?.missingGroups.findIndex((missingGroup) => group.id === missingGroup.id) === -1;
  };

  const isToFormRevReleased = () => {
    if (toFormRev && ![DocumentRevisionStatus.Released, DocumentRevisionStatus.Deprecated].includes(toFormRev.status)) {
      setToFormReleasedError(translate('bulk.migration.select.revision.error.message'));
    }
  };

  const hasApprovalMissingGroups = (approvalRequirements?.missingGroups ?? [])?.length > 0;
  const isLoading = approvalReqAsync?.isLoading || addUserToGroupsAsync?.isLoading;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      title="bulk.migration.supplier.revisions.summary"
    >
      <DialogHeader title={translate('bulk.migration.supplier.revisions.summary')} isLoading={isLoading} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography className={classes.selectedRevInfo} gutterBottom>
            {selectedDetails.length} {translate('bulk.migration.supplier.revisions.selected')}
          </Typography>
          {Object.keys(actionCountMap).map((key) => {
            return (
              <Typography className={classes.dialogContentText}>
                {translate('bulk.migration.map.revs', { key, number: actionCountMap[key] })}
              </Typography>
            );
          })}
          <Typography
            variant="body2"
            className={cx(classes.jobInfo, classes.marginTop16)}
            dangerouslySetInnerHTML={{ __html: translate('bulk.migration.job.delay.message') }}
          />
          <Box className={cx(classes.padding8, classes.marginTop8)}>
            {approvalRequirements && (
              <Box className={classes.approvalRequirementsBox}>
                <Typography className={classes.approvalRequirementsBoxText}>
                  {translate('bulk.migration.supplier.release.revision.message')}
                  <span className={classes.approvalRequirementsBoxEmail}>{approvalRequirements.email}</span>
                </Typography>
                <Typography
                  className={classes.approvalRequirementsBoxText}
                  dangerouslySetInnerHTML={{
                    __html: translate('bulk.migration.document.selected.groups.info.message'),
                  }}
                />
                <Box className={classes.approvalRequirementsRequiredGroupsBox}>
                  {approvalRequirements.requiredGroups.map((group: IApprovalRequirementGroup) => {
                    const isFulfilled = isApprovalRequirementFulfilled(group);

                    return (
                      <Box key={group.id} className={classes.groupNameContainer}>
                        <FontAwesomeIcon
                          className={isFulfilled ? classes.greenCheckCircle : classes.redWarning}
                          icon={isFulfilled ? solid('circle-check') : solid('triangle-exclamation')}
                        />
                        <Box className={classes.groupName}>
                          <Typography variant="subtitle2">{group.name}</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                {hasApprovalMissingGroups && (
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    data-cy="automation-add-to-groups"
                    onClick={onAddUserToGroup}
                    className={classes.zeroMarginBottom}
                  >
                    {translate('bulk.migration.add.to.groups')}
                  </Button>
                )}
              </Box>
            )}
          </Box>

          {!isEmpty(toFormReleasedError) && <div className={classes.errMsgStyle}>{toFormReleasedError}</div>}
          {!hasApprovalMissingGroups && isEmpty(toFormReleasedError) && (
            <Box className={classes.marginTop16}>
              <Typography className={classes.dialogContentText}>
                {translate('bulk.migration.supplier.revise.password.confirm.message')}
              </Typography>
              <FormControl className={cx(classes.width100, classes.marginTop8)}>
                <TextField
                  id="current-employee-password"
                  placeholder={translate('bulk.migration.employee.password')}
                  type="password"
                  size="small"
                  autoComplete="password"
                  onChange={(e) => setEmployeePassword(e.target.value)}
                  className={classes.employeePasswordText}
                />
                <TextField
                  id="current-employee-username"
                  type="text"
                  disabled
                  autoComplete="username"
                  name="username"
                />
              </FormControl>
            </Box>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={cx(classes.spaceBetweenFlex, classes.dialogActions)}>
        <Button onClick={handleClose} color="secondary" variant="contained">
          {translate('common.cancel')}
        </Button>
        {!hasApprovalMissingGroups && isEmpty(toFormReleasedError) && selectedDetails?.length > 0 && (
          <Button onClick={handleEmployeeConfirmation} color="primary" variant="contained" autoFocus>
            {translate('common.confirm')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MigrationConfirmationDialog;
