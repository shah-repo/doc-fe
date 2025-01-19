import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import { AxiosRequestConfig } from 'axios';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { intl } from '../../../common/intl';
import apiClient from '../../../state/apiClient';
import { BULK_MIGRATION_ADD_USER_TO_GROUPS, BULK_MIGRATION_GET_APPROVAL_REQUIREMENTS } from '../../../state/ducks/company/constants';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import { toastError, toastSuccess } from '../../components/notifications';
import { FBButton } from '../../form.builder';
import Colors from '../../layout/theme/utils/colors';
import { IApprovalRequirementGroup, IApprovalRequirements, ISelectedDetails } from './interface';

const MigrationConfirmationDialog: React.FC<{
  isOpen: boolean
  handleClose: () => void
  handleConfirmation: (password: string) => void
  selectedDetails: ISelectedDetails[]
  toDocumentTypeId: string
  toFormRev?: DocumentRevision
}> = ({ isOpen, handleClose, selectedDetails, handleConfirmation, toDocumentTypeId, toFormRev }) => {
  const [approvalRequirements, setApprovalRequirements] = useState<IApprovalRequirements>();
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

  function catchAxiosException (exception: any) {
    // setIsLoading(false);
    if (exception?.response?.status === 504) {
      toastError(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
    } else {
      toastError(exception?.response.data?.message);
    }
  }

  useEffect(() => {
    if (toDocumentTypeId) {
      fetchApprovalRequirements(toDocumentTypeId);
      isToFormRevReleased();
    }
  }, [toDocumentTypeId]);

  function fetchApprovalRequirements (toDocumentTypeId: string) {
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_APPROVAL_REQUIREMENTS}/${toDocumentTypeId}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        // console.log(data);
        setApprovalRequirements(data);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function addUserToGroups () {
    if (!approvalRequirements?.missingGroups?.length) {
      return;
    }

    const requestConfig: AxiosRequestConfig = {
      method: 'patch',
      url: `${BULK_MIGRATION_ADD_USER_TO_GROUPS}/${toDocumentTypeId}`,
      data: {
        missingGroups: approvalRequirements?.missingGroups,
      },
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        // console.log(data);
        setApprovalRequirements(data);
        toastSuccess('Automation user has been added to the required groups successfully');
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function handleEmployeeConfirmation () {
    handleConfirmation(employeePassword.current);
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
          <Typography variant="h5" style={{ marginBottom: '8px' }}>{selectedDetails.length} Supplier revisions selected</Typography>
          {Object.keys(actionCountMap).map(key => {
            return <Typography variant="subtitle2">{key} - {actionCountMap[key]} revisions</Typography>;
          })}
          <Typography variant="body2" style={{ marginTop: '16px' }}>
            This will fire a <b>JOB request</b>, which might take 10 mins or more, depending on the network congestion.
          </Typography>
        </DialogContentText>

        <Box style={{ padding: '8px', marginTop: '8px' }}>
          {approvalRequirements && (
            <Box
              style={{
                padding: '12px',
                backgroundColor: Colors.background_blue,
                borderRadius: '4px',
              }}
            >
              <Typography variant="body2" style={{ marginBottom: '4px', color: Colors.light_gray_II }}>
                For revisions, that are already Released, migration would create a new Revision and automate its approval & release, using <i>the current user</i>
                <span style={{ fontWeight: 'bold', color: Colors.bright_blue, display: 'block' }}>
                  {approvalRequirements.email}
                </span>
              </Typography>
              <Typography variant="body2" style={{ margin: '8px 0px 4px 0px', color: Colors.light_gray_II }}>
                Based on the Document Type selected, this user <b>should be a part of the groups</b> listed below, without
                which the process will fail.
              </Typography>
              <Box py={1} mt={0.3} display="flex" style={{ gap: '8px' }}>
                {approvalRequirements.requiredGroups.map((group) => {
                  return (
                    <Box ml={1} display="flex" key={group.id}>
                      {isApprovalRequirementFulfilled(group) && <CheckCircleIcon style={{ color: Colors.green }} />}
                      {!isApprovalRequirementFulfilled(group) && <WarningIcon style={{ color: Colors.red }} />}
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
                onClick={addUserToGroups}
                variant="outlined"
                color="primary"
                style={{ marginBottom: '0px' }}
              />}
            </Box>
          )}
        </Box>

        {!isEmpty(toFormReleasedError) && (
          <div style={{ color: Colors.red, backgroundColor: Colors.light_red, padding: '4px' }}>{toFormReleasedError}</div>
        )}

        {approvalRequirements?.missingGroups?.length === 0 && isEmpty(toFormReleasedError)
          && <>
            <p>Are you sure you want to revise these Suppliers? Please provide the password to confirm.</p>

            <FormControl
              style={{ width: '100%' }}
            >
              <TextField
                id="current-employee-password"
                label="Employee Password"
                type="password"
                onChange={e => setEmployeePassword(e.target.value)}
                style={{ width: '100%', border: '0px', borderBottom: `1px solid ${Colors.gray_goose}` }}
              />
            </FormControl>
            {/* <InputField
              name="password"
              label="transition.action.password"
              dataCy="transition.action.password"
              inputProps={{ type: 'password' }}
              validate={validator(required)}
            /> */}
          </>
        }

      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        {approvalRequirements?.missingGroups?.length === 0 && isEmpty(toFormReleasedError)
        && <Button onClick={handleEmployeeConfirmation} color="primary" autoFocus>
          Confirm
        </Button>}
      </DialogActions>
    </Dialog>
  );
};

export default MigrationConfirmationDialog;
