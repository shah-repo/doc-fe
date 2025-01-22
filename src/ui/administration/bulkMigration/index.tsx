/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Select, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import axios, { AxiosRequestConfig } from 'axios';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { intl, translate } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import { encodeString } from '../../../common/utils/helpers';
import apiClient from '../../../state/apiClient';
import { BULK_MIGRATION_CANCEL_SCAN, BULK_MIGRATION_GET_DOCUMENT_TYPES, BULK_MIGRATION_GET_DOCUMENT_TYPE_FORM_DETAILS, BULK_MIGRATION_GET_ELIGIBLE_REVS, BULK_MIGRATION_GET_SCAN_DETAILS, BULK_MIGRATION_REGISTER_SCAN, BULK_MIGRATION_REGISTER_SCAN_FOR_RUN, BULK_MIGRATION_START_REVS_MIGRATION, BULK_MIGRATION_UPDATE_SCAN } from '../../../state/ducks/company/constants';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import DateTime from '../../components/DateTime';
import { toastError, toastInfo, toastSuccess } from '../../components/notifications';
import { FBButton } from '../../form.builder';
import Colors from '../../layout/theme/utils/colors';
import { IBulkMigrationDocumentType, IBulkMigrationScanDetails, INTERVAL_DURATION, ISchemaItem, ISelectedDetails, MIGRATION_STATUS_ENUM } from './interface';
import MigrationConfirmationDialog from './MigrationConfirmation.dialog';
import MigrationMappingDialog from './MigrationMapping.dialog';
import RevsTable from './RevsTable';
import useStyles from './styles';

// let call: CancelTokenSource;

const BulkMigrationContainer: React.FC = () => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [documentTypesList, setDocumentTypesList] = useState<IBulkMigrationDocumentType[]>([]);

  const [fromDocumentTypeId, setFromDocumentTypeId] = useState<string>('');
  const [fromFormRevId, setFromFormRevId] = useState<string>('');
  const [toDocumentTypeId, setToDocumentTypeId] = useState<string>('');
  const [toFormRevId, setToFormRevId] = useState<string>('');

  const [fromFormRevsList, setFromFormRevsList] = useState<DocumentRevision[]>([]);
  const [toFormRevsList, setToFormRevsList] = useState<DocumentRevision[]>([]);

  const [eligibleRevsCount, setEligibleRevsCount] = useState<number>(0);

  const [scanDetails, setScanDetails] = useState<IBulkMigrationScanDetails>();

  const [selectedRows, setSelectedRows] = useState<ISelectedDetails[]>([]);
  const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Reference to store the interval ID.

  useEffect(() => {
    fetchAllDocumentTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function commonSetUp () {
    // call?.cancel();
    // call = axios.CancelToken.source();
    setIsLoading(true);
    setErrorMessage('');
  }

  function catchAxiosException (exception: any) {
    setIsLoading(false);
    if (axios.isCancel(exception)) {
      return;
    }
    if (exception?.response?.status === 504) {
      setErrorMessage(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
    } else {
      toastInfo(exception?.response.data?.message);
    }
  }

  useEffect(() => {
    if (scanDetails?.status === MIGRATION_STATUS_ENUM.STARTED) {
      // Set up the interval when status becomes 'Started'
      intervalRef.current = setInterval(() => {
        getScanDetails();
      }, INTERVAL_DURATION); // 10 seconds interval
    }

    if (scanDetails?.status === MIGRATION_STATUS_ENUM.MAPPING && intervalRef.current) {
      // Clear the interval when status becomes 'Mapping'
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Cleanup function to clear the interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [scanDetails]);

  function fetchAllDocumentTypes () {
    commonSetUp();

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: BULK_MIGRATION_GET_DOCUMENT_TYPES,
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
        setIsLoading(false);
        setDocumentTypesList(data);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function fetchFormRevsForDocumentType (
    documentTypeId: string,
    section: string,
  ) {
    commonSetUp();

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_DOCUMENT_TYPE_FORM_DETAILS}/${documentTypeId}?isGetNewSchema=${section === 'from' ? 'false' : 'true'}`,
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
        setIsLoading(false);

        const { formRevs } = data;
        if (section === 'from') {
          setFromFormRevsList(formRevs);
        } else if (section === 'to') {
          setToFormRevsList(formRevs);
        }
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function fetchEligibleRevisionsOfRevType (formRevId: string) {
    commonSetUp();

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_GET_ELIGIBLE_REVS}/${formRevId}?isCountOnly=true`,
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
        setIsLoading(false);
        setEligibleRevsCount(data);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function registerScanForRevisions () {
    commonSetUp();
    if (toFormRevId) {
      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: `${BULK_MIGRATION_REGISTER_SCAN}`,
        data: {
          fromDocumentTypeId,
          fromFormRevId,
          toDocumentTypeId,
          toFormRevId,
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
          console.log(data);
          setIsLoading(false);
          setScanDetails(data);
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  }

  function getScanDetails () {
    if (scanDetails?.id) {
      const requestConfig: AxiosRequestConfig = {
        method: 'get',
        url: `${BULK_MIGRATION_GET_SCAN_DETAILS}/${scanDetails.id}`,
        headers: {
          Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
        },
        // cancelToken: call.token,
      };

      apiClient
        .request(requestConfig)
        .then((resp) => resp)
        .then(({ data }) => {
          setScanDetails(data);
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  }

  function startRevisionsScan () {
    if (!scanDetails?.toFormSchema?.length) {
      toastError(`Mapping Logic has not been set. 
        Click on "Mapping Logic" to define how the previous form schema maps to the current one`);
      return;
    }

    commonSetUp();
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${BULK_MIGRATION_REGISTER_SCAN_FOR_RUN}/${scanDetails?.id}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };

    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        console.log(data);
        setIsLoading(false);
        setScanDetails(data);
        toastSuccess(
          'Scan request has been submitted. Please check back in some time.',
        );
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function updateScanMapping (fromRevSchema: ISchemaItem[], toRevSchema: ISchemaItem[]) {
    if (scanDetails) {
      commonSetUp();
      const requestConfig: AxiosRequestConfig = {
        method: 'patch',
        url: `${BULK_MIGRATION_UPDATE_SCAN}/${scanDetails.id}`,
        data: {
          fromFormSchema: fromRevSchema,
          toFormSchema: toRevSchema,
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
          console.log(data);
          setIsLoading(false);
          toastSuccess(
            'Scan mapping logic has been updated. Click Preview to see this logic in action.',
          );
          registerScanForRevisions();
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  }

  function cancelScanForRevisions () {
    commonSetUp();
    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${BULK_MIGRATION_CANCEL_SCAN}/${scanDetails?.id}`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };

    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setIsLoading(false);
        setScanDetails(data);
        toastSuccess('Scan request has been canceled. Please refresh.');
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  function handleDocumentTypeChange (value: string, fieldName: string) {
    if (fieldName === 'fromDocumentTypeId') {
      setFromDocumentTypeId(value);
    } else if (fieldName === 'toDocumentTypeId') {
      setToDocumentTypeId(value);
    }
  }

  function handleFormRevSelection (
    selectedFormRevId: string,
    fieldName: string,
  ) {
    if (fieldName === 'fromFormRevId') {
      // Get the number of eligible formRevisions
      fetchEligibleRevisionsOfRevType(selectedFormRevId);
      setFromFormRevId(selectedFormRevId);
    }

    if (fieldName === 'toFormRevId') {
      // If the from and to Document TypeId are the same, then the toFormRevId version must be greater
      if (validateFormRevVersionNumbersAndStatus(selectedFormRevId)) {
        setToFormRevId(selectedFormRevId);
      }
    }
  }

  function validateFormRevVersionNumbersAndStatus (selectedFormRevId: string) {
    let isValidated = true;

    if (fromDocumentTypeId === toDocumentTypeId) {
      const fromFormRev = fromFormRevsList.find((formRev) => formRev.id === fromFormRevId);
      const fromFormVersion = fromFormRev?.version ?? -1;

      const toFormRev = toFormRevsList.find((formRev) => formRev.id === selectedFormRevId);
      const toFormVersion = toFormRev?.version ?? -1;

      if (fromFormRev?.document.docId === toFormRev?.document.docId && toFormVersion <= fromFormVersion) {
        isValidated = false;
        toastError('Must migrate to a higher Form Rev');
      }
    }
    return isValidated;
  }

  function handleSelectedRowsChange (selected: ISelectedDetails[]) {
    setSelectedRows(selected);
  }

  const confirmSubmission = () => {
    setIsConfirmationDialogVisible(true);
  };

  const handleMigrationConfirmationDialogClose = () => {
    setIsConfirmationDialogVisible(false);
  };

  const handleMigrationConfirmation = (employeePassword: string) => {
    // Take all the ones selected & send to BE
    setIsLoading(true);
    setErrorMessage('');

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${BULK_MIGRATION_START_REVS_MIGRATION}/${scanDetails?.id}`,
      data: {
        revIds: selectedRows.map(entry => entry.id),
        password: employeePassword,
      },
      headers: {
        Authorization: `bearer_password ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}:${encodeString(employeePassword)}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setIsLoading(false);
        handleMigrationConfirmationDialogClose();
        toastSuccess('Supplier Migration job request has been placed. Please check back in some time.');
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  };

  useEffect(() => {
    if (fromDocumentTypeId) {
      fetchFormRevsForDocumentType(fromDocumentTypeId, 'from');
    }
  }, [fromDocumentTypeId]);

  useEffect(() => {
    if (toDocumentTypeId) {
      fetchFormRevsForDocumentType(toDocumentTypeId, 'to');
    }
  }, [toDocumentTypeId]);

  useEffect(() => {
    if (fromDocumentTypeId && toDocumentTypeId && fromFormRevId && toFormRevId) {
      registerScanForRevisions();
    }
  }, [fromDocumentTypeId, toDocumentTypeId, fromFormRevId, toFormRevId]);

  // Migration mapping Dialog
  const [isMigrationMappingDialogVisible, setIsMigrationMappingDialogVisible]
    = useState<boolean>(false);
  const showMappingRules = () => {
    setIsMigrationMappingDialogVisible(true);
  };

  const handleMigrationMappingDialogClose = () => {
    setIsMigrationMappingDialogVisible(false);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box className={classes.flexBox}>
          <Box>
            <Typography variant="h1" className={classes.title}>
              {translate('administration.bulk.migration.title')}
            </Typography>
            <Typography variant="subtitle1" className={classes.subtitle}>
              {translate('administration.bulk.migration.subtitle')}
            </Typography>
            {/* <br className={classes.spaceTitle} /> */}
          </Box>
          { selectedRows.length > 0 && <FBButton
            label="Migrate Suppliers"
            dataCy="migrate-suppliers-btn"
            onClick = {confirmSubmission}
            variant="contained"
            color="primary"
          /> }
        </Box>

        {isLoading && (
          <LinearProgress
            className={classes.progress}
            data-cy="saving-progress-bar"
          />
        )}
        <Box
          className={classes.flexBox}
          style={{ justifyContent: 'space-between' }}
        >
          <Box className={classes.boxForSelection}>
            <Typography variant="h5"> Migrate From </Typography>
            <Typography variant="subtitle2"> Select the Document Type & Form Rev </Typography>

            <Box style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <FormControl
                className={classes.formControl}
                style={{ width: '40%' }}
              >
                <InputLabel id="document-type-migrate-from"> Document Type </InputLabel>
                <Select
                  labelId="document-type-migrate-from"
                  value={fromDocumentTypeId}
                  onChange={(event) =>
                    handleDocumentTypeChange(
                      event.target.value as string,
                      'fromDocumentTypeId',
                    )
                  }
                >
                  {documentTypesList.map((type) => (
                    <MenuItem value={type.id} key={type.id}>
                      <em>
                        {type.documentTypeName} - {type.documentTypeAcronym}
                      </em>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText> */}
              </FormControl>

              <FormControl
                className={classes.formControl}
                style={{ width: '60%' }}
              >
                <InputLabel id="form-rev-migrate-from"> Form Rev Selection </InputLabel>
                <Select
                  labelId="form-rev-migrate-from"
                  value={fromFormRevId}
                  onChange={(event) =>
                    handleFormRevSelection(
                      event.target.value as string,
                      'fromFormRevId',
                    )
                  }
                >
                  {fromFormRevsList.map((formRev) => (
                    <MenuItem value={formRev.id} key={formRev.id}>
                      <em>
                        {formRev.document?.docId} • {formRev.name} •{' '}
                        {formRev.displayRevision} • {formRev.status}
                      </em>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText> */}
              </FormControl>
            </Box>
            {fromDocumentTypeId && fromFormRevId && (
              <Typography variant="subtitle2">
                  Eligible Revisions - <span style={{ color: Colors.black }}> {eligibleRevsCount} </span>
              </Typography>
            )}
          </Box>

          <Box
            className={classes.flexBoxColumn}
            style={{ marginTop: '16px', gridGap: 0, alignItems: 'center' }}
          >
            {scanDetails?.id && (
              <Box className={cx(classes.buttons, classes.flexBoxColumn)}>
                {[MIGRATION_STATUS_ENUM.IN_PROGRESS, MIGRATION_STATUS_ENUM.STARTED, MIGRATION_STATUS_ENUM.MAPPING].includes(scanDetails.status)
                  && <>
                    <FBButton
                      label="Cancel Current Scan"
                      dataCy="supplier-migration-scan-cancel"
                      onClick={cancelScanForRevisions}
                      variant="outlined"
                      color="primary"
                      style={{ marginBottom: '0px' }}
                    />
                    <Typography variant="caption" className={classes.blinking}>{scanDetails.status}
                      <RefreshIcon
                        style={{ cursor: 'pointer', marginLeft: '4px', fontSize: '16px' }}
                        onClick={getScanDetails}
                      />
                    </Typography>
                  </>
                }
                {scanDetails.status === MIGRATION_STATUS_ENUM.COMPLETED && (
                  <>
                    <FBButton
                      label="Run Scan"
                      dataCy="bulk-migration-scan"
                      onClick={startRevisionsScan}
                      variant="outlined"
                      color="primary"
                    />
                    <DateTime
                      value={scanDetails.completedAt}
                      format={MomentFormats.BriefDateTime}
                      className={cx(classes.dateTimeLabel)}
                    />
                  </>
                )}
                {[MIGRATION_STATUS_ENUM.INITIALIZED, MIGRATION_STATUS_ENUM.CANCELLED].includes(scanDetails.status)
                    && <FBButton
                      label="Run Scan"
                      dataCy="bulk-migration-scan"
                      variant="outlined"
                      color="primary"
                      onClick={startRevisionsScan}
                    />
                }
                {scanDetails.status === MIGRATION_STATUS_ENUM.FAILED && (
                  <>
                    <FBButton
                      label="Run Scan"
                      dataCy="bulk-migration-scan"
                      onClick={startRevisionsScan}
                      variant="outlined"
                      color="primary"
                    />
                      Last Failed at: <DateTime
                      value={scanDetails.completedAt}
                      format={MomentFormats.BriefDateTime}
                      className={cx(classes.dateTimeLabel)}
                    />
                  </>
                )}
              </Box>
            )}
            {toFormRevId && fromFormRevId && (
              <Box>
                <Button variant="text" color="secondary"
                  onClick={showMappingRules}> Mapping Logic </Button>
              </Box>
            )}
          </Box>

          <Box className={classes.boxForSelection}>
            <Typography variant="h5">Migrate To</Typography>
            <Typography variant="subtitle2">Select the Document Type & Form Rev</Typography>

            <Box style={{ display: 'flex', gap: '8px' }}>
              <FormControl
                className={classes.formControl}
                style={{ width: '40%' }}
              >
                <InputLabel id="document-type-migrate-to"> Document Type </InputLabel>
                <Select
                  labelId="document-type-migrate-to"
                  value={toDocumentTypeId}
                  onChange={(event) =>
                    handleDocumentTypeChange(
                      event.target.value as string,
                      'toDocumentTypeId',
                    )
                  }
                >
                  {documentTypesList.map((type) => (
                    <MenuItem value={type.id} key={type.id}>
                      <em>
                        {type.documentTypeName} - {type.documentTypeAcronym}
                      </em>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText> */}
              </FormControl>

              <FormControl
                className={classes.formControl}
                style={{ width: '60%' }}
              >
                <InputLabel id="form-rev-migrate-to"> Form Rev Selection </InputLabel>
                <Select
                  labelId="form-rev-migrate-to"
                  value={toFormRevId}
                  onChange={(event) =>
                    handleFormRevSelection(
                      event.target.value as string,
                      'toFormRevId',
                    )
                  }
                >
                  {toFormRevsList.map((formRev) => (
                    <MenuItem value={formRev.id} key={formRev.id}>
                      <em>
                        {formRev.document?.docId} • {formRev.name} •{' '}
                        {formRev.displayRevision} • {formRev.status}
                      </em>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Box>
      <div className={classes.panels}>
        {!isEmpty(errorMessage) && (
          <div style={{ color: Colors.red, backgroundColor: Colors.light_red, padding: '4px' }}>{errorMessage}</div>
        )}
        {!isLoading && isEmpty(errorMessage) && scanDetails?.id
          && <Box>
            <RevsTable scanId={scanDetails.id} toDocumentTypeId={toDocumentTypeId} handleSelectedRowsChange={handleSelectedRowsChange} />
          </Box>
        }
        {!isLoading && isEmpty(errorMessage) && scanDetails?.id
          && [MIGRATION_STATUS_ENUM.STARTED].includes(scanDetails?.status)
          && <Box className={classes.searchIconContainer}>
            <SearchIcon className={classes.searchIcon} />
          </Box>
        }
      </div>
      {isMigrationMappingDialogVisible && fromFormRevId && toFormRevId && (
        <MigrationMappingDialog
          isOpen={isMigrationMappingDialogVisible}
          handleClose={handleMigrationMappingDialogClose}
          fromRev={fromFormRevsList.find((rev) => rev.id === fromFormRevId)}
          toRev={toFormRevsList.find((rev) => rev.id === toFormRevId)}
          updateScanMapping={updateScanMapping}
          scanDetails={scanDetails}
        />
      )}
      {
        isConfirmationDialogVisible && <MigrationConfirmationDialog
          isOpen={isConfirmationDialogVisible}
          handleClose={handleMigrationConfirmationDialogClose}
          selectedDetails={selectedRows}
          handleConfirmation={handleMigrationConfirmation}
          toDocumentTypeId={toDocumentTypeId}
          toFormRev={toFormRevsList.find((formRev) => formRev.id === toFormRevId)}
        />
      }
    </Box>
  );
};

export default BulkMigrationContainer;
