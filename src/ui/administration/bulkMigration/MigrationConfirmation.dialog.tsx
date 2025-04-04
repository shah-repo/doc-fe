import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { FBButton } from '../../form.builder';
import { IApprovalRequirementGroup, ISelectedDetails } from './interface';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';

const MigrationConfirmationDialog: React.FC<{
  isOpen: boolean
  handleClose: () => void
  handleConfirmation: (selectedDetails: ISelectedDetails[], password: string) => void
  selectedDetails: ISelectedDetails[]
  toDocumentTypeId: string
  toFormRev?: DocumentRevision
}> = ({ isOpen, handleClose, selectedDetails, handleConfirmation, toDocumentTypeId, toFormRev }) => {
  const classes = useStyles();

  const {
    approvalRequirements,
    fetchApprovalRequirements,
    addUserToGroups,
  } = useBulkMigration();
  const [toFormReleasedError, setToFormReleasedError] = useState<string>('');

  const employeePassword = useRef<string>('');
  // const [isLoading, setIsLoading] = useState(false);

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

  function handleEmployeeConfirmation () {
    handleConfirmation(selectedDetails, employeePassword.current);
  }

  function setEmployeePassword (empPassword: string) {
    employeePassword.current = empPassword;
  }

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
      <DialogTitle id="alert-dialog-title">Supplier Revisions Migration Summary</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="h5" className={classes.marginBottom8}>{selectedDetails.length} Supplier revisions selected</Typography>
          {Object.keys(actionCountMap).map(key => {
            return <Typography variant="subtitle2">{key} - {actionCountMap[key]} revisions</Typography>;
          })}
          <Typography variant="body2" className={classes.marginTop16}>
            This will fire a <b>JOB request</b>, which might take 10 mins or more, depending on the network congestion.
          </Typography>
        </DialogContentText>

        <Box className={cx(classes.padding8, classes.marginTop8)}>
          {approvalRequirements && (
            <Box className={classes.approvalRequirementsBox}>
              <Typography variant="body2" className={classes.approvalRequirementsBoxText}>
                For revisions, that are already Released, migration would create a new Revision and automate its approval & release, using <i>the current user</i>
                <span className={classes.approvalRequirementsBoxEmail}>
                  {approvalRequirements.email}
                </span>
              </Typography>
              <Typography variant="body2" className={classes.approvalRequirementsBoxText}>
                Based on the Document Type selected, this user <b>should be a part of the groups</b> listed below, without
                which the process will fail.
              </Typography>
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
            <p>Are you sure you want to revise these Suppliers? Please provide the password to confirm.</p>
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
          Cancel
        </Button>
        {approvalRequirements?.missingGroups?.length === 0 && isEmpty(toFormReleasedError) && selectedDetails?.length
        && <Button onClick={handleEmployeeConfirmation} color="primary" autoFocus>
          Confirm
        </Button>}
      </DialogActions>
    </Dialog>
  );
};

export default MigrationConfirmationDialog;
