import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { translate } from '../../../common/intl';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { FBButton } from '../../form.builder';
import { IApprovalRequirementGroup, ISelectedDetails } from './interface';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';

interface MigrationConfirmationDialogProps {
  isOpen: boolean
  handleClose: () => void
  handleConfirmation: (selectedDetails: ISelectedDetails[], password: string) => void
  selectedDetails: ISelectedDetails[]
  toDocumentTypeId: string
  toFormRev?: DocumentRevision
}
const MigrationConfirmationDialog: React.FC<MigrationConfirmationDialogProps> = ({ isOpen, handleClose, selectedDetails, handleConfirmation, toDocumentTypeId, toFormRev }) => {
  const classes = useStyles();

  const {
    approvalRequirements,
    fetchApprovalRequirements,
    addUserToGroups,
  } = useBulkMigration();
  const [toFormReleasedError, setToFormReleasedError] = useState<string>('');

  const employeePassword = useRef<string>('');

  const actionCountMap: { [key: string]: number } = {};
  selectedDetails.forEach(detail => {
    if (!actionCountMap[detail.action]) {
      actionCountMap[detail.action] = 0;
    }
    actionCountMap[detail.action] += 1;
  });

  useEffect(() => {
    if (toDocumentTypeId) {
      fetchApprovalRequirements(toDocumentTypeId);
      isToFormRevReleased();
    }
  }, [toDocumentTypeId]);

  const handleEmployeeConfirmation = () => {
    handleConfirmation(selectedDetails, employeePassword.current);
  };

  const setEmployeePassword = (empPassword: string) => {
    employeePassword.current = empPassword;
  };

  const isApprovalRequirementFulfilled = (group: IApprovalRequirementGroup) => {
    return (
      approvalRequirements?.missingGroups.findIndex(
        (missingGroup) => group.id === missingGroup.id,
      ) === -1
    );
  };

  const isToFormRevReleased = () => {
    if (
      toFormRev
      && ![
        DocumentRevisionStatus.Released,
        DocumentRevisionStatus.Deprecated,
      ].includes(toFormRev.status)
    ) {
      setToFormReleasedError('The selected form revision must be approved and released.');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{translate('bulk.migration.supplier.revisions.summary')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="h5" className={classes.marginBottom8}>{selectedDetails.length} {translate('bulk.migration.supplier.revisions.selected')}</Typography>
          {Object.keys(actionCountMap).map(key => {
            return <Typography variant="subtitle2">{translate('bulk.migration.map.revs', { key, number: actionCountMap[key] })}</Typography>;
          })}
          <Typography variant="body2" className={classes.marginTop16} dangerouslySetInnerHTML={{ __html: translate('bulk.migration.job.delay.message') }} />
        </DialogContentText>

        <Box className={cx(classes.padding8, classes.marginTop8)}>
          {approvalRequirements && (
            <Box className={classes.approvalRequirementsBox}>
              <Typography variant="body2" className={classes.approvalRequirementsBoxText}>
                {translate('bulk.migration.supplier.release.revision.message')}
                <span className={classes.approvalRequirementsBoxEmail}>
                  {approvalRequirements.email}
                </span>
              </Typography>
              <Typography variant="body2" className={classes.approvalRequirementsBoxText} dangerouslySetInnerHTML={{ __html: translate('bulk.migration.document.selected.groups.info.message') }} />
              <Box className={classes.approvalRequirementsRequiredGroupsBox}>
                {approvalRequirements.requiredGroups.map((group) => {
                  return (
                    <Box ml={1} display="flex" key={group.id}>
                      {isApprovalRequirementFulfilled(group) && <CheckCircleIcon className={classes.greenCheckCircle} />}
                      {!isApprovalRequirementFulfilled(group) && <WarningIcon className={classes.redWarning} />}
                      <Box ml={0.5}>
                        <Typography variant="subtitle2">{group.name}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              {approvalRequirements?.missingGroups?.length > 0 && <FBButton
                label="Add To Groups"
                dataCy="automation-add-to-groups"
                onClick={e => addUserToGroups(toDocumentTypeId)}
                variant="outlined"
                color="primary"
                className={classes.zeroMarginBottom}
              />}
            </Box>
          )}
        </Box>

        {!isEmpty(toFormReleasedError) && (
          <div className={classes.errMsgStyle}>{toFormReleasedError}</div>
        )}

        {approvalRequirements?.missingGroups?.length === 0 && isEmpty(toFormReleasedError)
          && <>
            <p>{translate('bulk.migration.supplier.revise.password.confirm.message')}</p>
            <FormControl className={classes.width100}>
              <TextField
                id="current-employee-password"
                label="Employee Password"
                type="password"
                onChange={e => setEmployeePassword(e.target.value)}
                className={classes.employeePasswordText}
              />
            </FormControl>
          </>
        }

      </DialogContent>
      <DialogActions className={classes.spaceBetweenFlex}>
        <Button onClick={handleClose} color="primary">
          {translate('common.cancel')}
        </Button>
        {approvalRequirements?.missingGroups?.length === 0 && isEmpty(toFormReleasedError) && selectedDetails?.length
        && <Button onClick={handleEmployeeConfirmation} color="primary" autoFocus>
          {translate('common.confirm')}
        </Button>}
      </DialogActions>
    </Dialog>
  );
};

export default MigrationConfirmationDialog;
