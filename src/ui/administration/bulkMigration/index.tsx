/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Popover,
  Select,
  Typography,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import axios, { AxiosRequestConfig } from 'axios';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { intl, translate } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import apiClient from '../../../state/apiClient';
import {
  BULK_MIGRATION_CANCEL_SCAN,
  BULK_MIGRATION_GET_APPROVAL_REQUIREMENTS, BULK_MIGRATION_GET_DOCUMENT_TYPES, BULK_MIGRATION_GET_DOCUMENT_TYPE_FORM_DETAILS, BULK_MIGRATION_GET_ELIGIBLE_REV_COUNT,
  BULK_MIGRATION_GET_LATEST_COMPLETED_SCAN,
  BULK_MIGRATION_REGISTER_SCAN,
  BULK_MIGRATION_UPGRADE_FORM,
} from '../../../state/ducks/company/constants';
import {
  DocumentRevision,
  DocumentRevisionStatus,
} from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import DateTime from '../../components/DateTime';
import {
  toastError,
  toastInfo,
  toastSuccess,
} from '../../components/notifications';
import { FBButton } from '../../form.builder';
import Colors from '../../layout/theme/utils/colors';
import {
  IApprovalRequirementGroup,
  IApprovalRequirements,
  IBulkMigrationDocumentType,
  ISupplierScanDetails,
  MIGRATION_STATUS_ENUM,
} from './interface';
import MigrationMappingDialog from './MigrationMapping.dialog';
import RevsTable from './RevsTable';
import useStyles from './styles';

// let call: CancelTokenSource;

const BulkMigrationContainer: React.FC = () => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [documentTypesList, setDocumentTypesList] = useState<
  IBulkMigrationDocumentType[]
  >([]);

  const [fromDocumentTypeId, setFromDocumentTypeId] = useState<string>('');
  const [fromFormRevId, setFromFormRevId] = useState<string>('');
  const [toDocumentTypeId, setToDocumentTypeId] = useState<string>('');
  const [toFormRevId, setToFormRevId] = useState<string>('');

  const [fromFormRevsList, setFromFormRevsList] = useState<DocumentRevision[]>(
    [],
  );
  const [toFormRevsList, setToFormRevsList] = useState<DocumentRevision[]>([]);

  const [eligibleRevsCount, setEligibleRevsCount] = useState<number>(0);

  const [approvalRequirements, setApprovalRequirements]
    = useState<IApprovalRequirements>();

  const [newFormSchema, setNewFormSchema] = useState([]);
  const [isFormSchemaExpanded, setIsFormSchemaExpanded] = useState(false);

  const [scanDetails, setScanDetails] = useState<ISupplierScanDetails>();
  // const [scanResults, setScanResults] = useState<ISupplierScanResultRev[]>([]);

  useEffect(() => {
    fetchAllDocumentTypes();
    fetchLatestScanDetails();
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

        const { formRevs, predeterminedFormSchema } = data;
        if (section === 'from') {
          setFromFormRevsList(formRevs);
        } else if (section === 'to') {
          setToFormRevsList(formRevs);
        }

        if (predeterminedFormSchema) {
          setNewFormSchema(predeterminedFormSchema);
        } else {
          setNewFormSchema([]);
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
      url: `${BULK_MIGRATION_GET_ELIGIBLE_REV_COUNT}/${formRevId}?isCountOnly=true`,
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

  function fetchApprovalRequirements (toDocumentTypeId: string) {
    commonSetUp();

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
        setIsLoading(false);
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  }

  // Gets a completed scan detail & top 25 results for the user to start reviewing.
  const fetchLatestScanDetails = () => {
    commonSetUp();

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: BULK_MIGRATION_GET_LATEST_COMPLETED_SCAN,
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

        const { scanDetails }: { scanDetails: ISupplierScanDetails } = data;

        if (scanDetails?.id) {
          setScanDetails(scanDetails);
          // setScanResults(scanResults ?? []);
        }
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  };

  const createNewFormRevision = () => {
    commonSetUp();
    if (toDocumentTypeId) {
      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: `${BULK_MIGRATION_UPGRADE_FORM}/${toDocumentTypeId}`,
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

          // Once the form is upgraded
          fetchFormRevsForDocumentType(toDocumentTypeId, 'to');
          // setNeedToReviseForm(false);
          // setNeedToReleaseForm(true);
          toastSuccess(
            `Form has been upgraded to Rev ${data.displayRevision} . Please review and approve for next steps.`,
          );
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  };

  function registerScanForRevisions () {
    commonSetUp();
    if (toFormRevId) {
      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: `${BULK_MIGRATION_REGISTER_SCAN}/${toFormRevId}`,
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
            'Scan request has been submitted. Please check back in some time.',
          );
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  }

  function cancelScanForRevisions () {
    commonSetUp();
    if (toFormRevId) {
      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: `${BULK_MIGRATION_CANCEL_SCAN}/${toFormRevId}`,
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
          toastSuccess('Scan request has been canceled. Please refresh.');
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
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

      // Get the form that can be used to release and its requirements
      fetchApprovalRequirements(toDocumentTypeId);
    }
  }

  function validateFormRevVersionNumbersAndStatus (selectedFormRevId: string) {
    let isValidated = true;

    if (fromDocumentTypeId === toDocumentTypeId) {
      const fromFormVersion
        = fromFormRevsList.find((formRev) => formRev.id === fromFormRevId)
          ?.version ?? -1;

      const toFormRev = toFormRevsList.find(
        (formRev) => formRev.id === selectedFormRevId,
      );
      const toFormVersion = toFormRev?.version ?? -1;

      if (toFormVersion <= fromFormVersion) {
        isValidated = false;
        toastError('Must migrate to a higher Form Rev');
      }

      if (
        toFormRev
        && ![
          DocumentRevisionStatus.Released,
          DocumentRevisionStatus.Deprecated,
        ].includes(toFormRev.status)
      ) {
        isValidated = false;
        toastError(
          'Form revisions must be approved and released, for selection. Kindly review it and once released, come back here to select the same.',
        );
      }
    }
    return isValidated;
  }

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

  const toggleFormSchema = () => {
    setIsFormSchemaExpanded(!isFormSchemaExpanded);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleUpgradeFormPopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUpgradeFormPopoverClose = () => {
    setAnchorEl(null);
  };

  const isApprovalRequirementFulfilled = (group: IApprovalRequirementGroup) => {
    return (
      approvalRequirements?.missingGroups.findIndex(
        (missingGroup) => group.id === missingGroup.id,
      ) === -1
    );
  };

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
        <Box style={{ width: '100%' }}>
          <Typography variant="h1" className={classes.title}>
            {translate('administration.bulk.migration.title')}
          </Typography>
          {!isLoading && (
            <Typography variant="subtitle1" className={classes.subtitle}>
              {translate('administration.bulk.migration.subtitle')}
            </Typography>
          )}
          {/* <br className={classes.spaceTitle} /> */}
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
              <Typography variant="subtitle2">
                Select the Document Type & Form Rev
              </Typography>

              <Box style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <FormControl
                  className={classes.formControl}
                  style={{ width: '40%' }}
                >
                  <InputLabel id="document-type-migrate-from">
                    Document Type
                  </InputLabel>
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
                  <InputLabel id="form-rev-migrate-from">
                    Form Rev Selection
                  </InputLabel>
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
              {/* { fromDocumentTypeId && fromFormRevId
                && <Typography variant="subtitle2">Eligible Revisions - <span style={{ color: Colors.black }}>{eligibleRevsCount}</span>
                </Typography>
              } */}
            </Box>

            <Box
              className={classes.flexBoxColumn}
              style={{ marginTop: '16px', gridGap: 0, alignItems: 'center' }}
            >
              {fromDocumentTypeId && fromFormRevId && (
                <Typography variant="subtitle2">
                  Eligible Revisions -{' '}
                  <span style={{ color: Colors.black }}>
                    {eligibleRevsCount}
                  </span>
                </Typography>
              )}
              {scanDetails?.id && (
                <Box className={cx(classes.buttons, classes.flexBoxColumn)}>
                  {[
                    MIGRATION_STATUS_ENUM.IN_PROGRESS,
                    MIGRATION_STATUS_ENUM.STARTED,
                  ].includes(scanDetails.status) && (
                    <FBButton
                      label="Cancel Current Scan"
                      dataCy="supplier-migration-scan-cancel"
                      onClick={cancelScanForRevisions}
                      variant="outlined"
                      color="primary"
                    />
                  )}
                  {scanDetails.status === MIGRATION_STATUS_ENUM.COMPLETED && (
                    <>
                      <FBButton
                        label="Scan For Revisions"
                        dataCy="bulk-migration-scan"
                        onClick={registerScanForRevisions}
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
                  {!scanDetails.completedAt && <span>In Progress</span>}
                </Box>
              )}
              {!scanDetails?.id && toFormRevId && fromFormRevId && (
                <>
                  <Box className={classes.buttons}>
                    <FBButton
                      label="Scan For Revisions"
                      dataCy="bulk-migration-scan"
                      onClick={registerScanForRevisions}
                    />
                  </Box>
                </>
              )}
              {toFormRevId && fromFormRevId && (
                <Box>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={showMappingRules}
                  >
                    Mapping Rules
                  </Button>
                </Box>
              )}
            </Box>

            <Box className={classes.boxForSelection}>
              <Typography variant="h5"> Migrate To </Typography>
              <Typography variant="subtitle2">
                Select the Document Type & Form Rev
              </Typography>

              <Box style={{ display: 'flex', gap: '8px' }}>
                <FormControl
                  className={classes.formControl}
                  style={{ width: '40%' }}
                >
                  <InputLabel id="document-type-migrate-to">
                    Document Type
                  </InputLabel>
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
                  <InputLabel id="form-rev-migrate-to">
                    Form Rev Selection
                  </InputLabel>
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

              {newFormSchema.length > 0 && (
                <>
                  <Box
                    className={classes.buttons}
                    style={{ justifyContent: 'end' }}
                  >
                    <Button
                      variant="contained"
                      onClick={createNewFormRevision}
                      data-cy="supplier-migration-upgrade-form"
                    >
                      Upgrade Form
                    </Button>
                    <InfoIcon
                      onMouseEnter={handleUpgradeFormPopoverOpen}
                      onMouseLeave={handleUpgradeFormPopoverClose}
                    />
                    <Popover
                      style={{ pointerEvents: 'none' }}
                      classes={{
                        paper: classes.popoverPaper,
                      }}
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      onClose={handleUpgradeFormPopoverClose}
                      disableRestoreFocus
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ marginTop: '4px' }}
                      >
                        A new Form revision can be created with a predefined
                        Form schema. <i>This Rev would be created in Draft</i>.{' '}
                        <br />
                        You can preview it & once released, come back here to
                        select the new revision, to continue with migration.
                      </Typography>
                    </Popover>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          {approvalRequirements && (
            <Box
              style={{
                marginTop: '16px',
                padding: '8px',
                backgroundColor: Colors.background_blue,
                borderRadius: '4px',
              }}
            >
              <Typography variant="body2" style={{ marginBottom: '4px' }}>
                For revisions, that are already Released, migration would create
                a new Revision and automate its approval & release, using{' '}
                <span style={{ fontWeight: 'bold', color: Colors.bright_blue }}>
                  {approvalRequirements.email}
                </span>
              </Typography>
              <Typography variant="body2" style={{ margin: '0px 0px 4px 0px' }}>
                Based on the Document Type selected, this user{' '}
                <b>should be a part of the groups</b> listed below, without
                which the process will fail.
              </Typography>
              <Box py={1} mt={0.3} display="flex" style={{ gap: '8px' }}>
                {approvalRequirements.requiredGroups.map((group) => {
                  return (
                    <Box ml={1} display="flex" key={group.id}>
                      {isApprovalRequirementFulfilled(group) && (
                        <CheckCircleIcon style={{ color: Colors.green }} />
                      )}
                      {!isApprovalRequirementFulfilled(group) && (
                        <WarningIcon style={{ color: Colors.red }} />
                      )}
                      <Box ml={0.5}>
                        <Typography variant="subtitle2">
                          {group.name}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <div className={classes.panels}>
        {!isEmpty(errorMessage) && (
          <div style={{ color: 'red' }}>{errorMessage}</div>
        )}
        {!isLoading && isEmpty(errorMessage) && toFormRevId && (
          <Box>{scanDetails?.id && <RevsTable scanId={scanDetails.id} />}</Box>
        )}
      </div>
      {isMigrationMappingDialogVisible && fromFormRevId && toFormRevId && (
        <MigrationMappingDialog
          isOpen={isMigrationMappingDialogVisible}
          handleClose={handleMigrationMappingDialogClose}
          fromRev={fromFormRevsList.find((rev) => rev.id === fromFormRevId)}
          toRev={toFormRevsList.find((rev) => rev.id === toFormRevId)}
        />
      )}
    </Box>
  );
};

export default BulkMigrationContainer;
