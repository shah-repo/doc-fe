import { Box, Button, LinearProgress, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { intl, translate } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import apiClient from '../../../state/apiClient';
import { SUPPLIER_MIGRATION_CANCEL_SCAN, SUPPLIER_MIGRATION_GET_FORM_DETAILS, SUPPLIER_MIGRATION_GET_LATEST_COMPLETED_SCAN, SUPPLIER_MIGRATION_REGISTER_SCAN, SUPPLIER_MIGRATION_UPGRADE_FORM } from '../../../state/ducks/company/constants';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import DateTime from '../../components/DateTime';
import { toastInfo, toastSuccess } from '../../components/notifications';
import { FBButton } from '../../form.builder';
import SettingsPanel from '../general.settings/components/SettingsPanel';
import { ISupplierScanDetails, MIGRATION_STATUS_ENUM } from './interface';
import RevsTable from './RevsTable';
import useStyles from './styles';

// let call: CancelTokenSource;

const SupplierMigrationContainer: React.FC = () => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formToRevise, setFormToRevise] = useState<DocumentRevision>();
  // const [releasedFormDetails, setReleasedFormDetails] = useState<DocumentRevision>();
  const [newFormSchema, setNewFormSchema] = useState([]);
  const [needToReviseForm, setNeedToReviseForm] = useState(false);
  const [needToReleaseForm, setNeedToReleaseForm] = useState(false);

  const [isFormSchemaExpanded, setIsFormSchemaExpanded] = useState(false);

  const [scanDetails, setScanDetails] = useState<ISupplierScanDetails>();
  // const [scanResults, setScanResults] = useState<ISupplierScanResultRev[]>([]);

  useEffect(() => {
    fetchCurrentFormDetails();
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

  // Get the current FormDetails
  const fetchCurrentFormDetails = () => {
    commonSetUp();

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: SUPPLIER_MIGRATION_GET_FORM_DETAILS,
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

        const { formToRevise, isMatching, inProgressDocRevDetails, newFormSchema } = data;
        setFormToRevise(formToRevise);
        setNewFormSchema(newFormSchema);

        if (inProgressDocRevDetails?.id) {
          setNeedToReleaseForm(true);
          setNeedToReviseForm(false);
        } else {
          setNeedToReleaseForm(false);
          setNeedToReviseForm(isMatching);
        }
      })
      .catch((exception) => {
        catchAxiosException(exception);
      });
  };

  // Gets a completed scan detail & top 25 results for the user to start reviewing.
  const fetchLatestScanDetails = () => {
    commonSetUp();

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: SUPPLIER_MIGRATION_GET_LATEST_COMPLETED_SCAN,
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

        const { scanDetails }: {scanDetails: ISupplierScanDetails} = data;

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
    if (formToRevise) {
      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: `${SUPPLIER_MIGRATION_UPGRADE_FORM}/${formToRevise.id}`,
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
          setNeedToReviseForm(false);
          setNeedToReleaseForm(true);
          toastSuccess(`Form has been upgraded to Rev ${data.displayRevision} . Please review and approve for next steps.`);
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  };

  function registerScanForRevisions () {
    commonSetUp();
    if (formToRevise) {
      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: `${SUPPLIER_MIGRATION_REGISTER_SCAN}/${formToRevise.id}`,
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
          toastSuccess('Scan request has been submitted. Please check back in some time.');
        })
        .catch((exception) => {
          catchAxiosException(exception);
        });
    }
  }

  function cancelScanForRevisions () {
    commonSetUp();
    if (formToRevise) {
      const requestConfig: AxiosRequestConfig = {
        method: 'post',
        url: `${SUPPLIER_MIGRATION_CANCEL_SCAN}/${formToRevise.id}`,
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

  const toggleFormSchema = () => {
    setIsFormSchemaExpanded(!isFormSchemaExpanded);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box>
          <Typography
            variant="h1"
            className={classes.title}
          >
            {translate('administration.bulk.migration.title')}
          </Typography>
          {!isLoading && <Typography
            variant="subtitle1"
            className={classes.subtitle}
          >
            {translate('administration.bulk.migration.subtitle')}
          </Typography> }
          {/* <br className={classes.spaceTitle} /> */}
        </Box>
        {isLoading && <LinearProgress className={classes.progress} data-cy="saving-progress-bar" />}
      </Box>
      <div className={classes.panels}>
        {!isEmpty(errorMessage) && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {!isLoading && isEmpty(errorMessage) && formToRevise?.id && <Box>
          <Box className={classes.flexBox}>
            { needToReviseForm && <>
              <Typography variant="body1" className={classes.marginBottom}>
                A new Form revision will be created with an updated form schema. This Rev would be created in Draft. <br /> You can preview it & once released, come back here to update the <b>Supplier</b> revisions
              </Typography>
              <Box className={classes.buttons}>
                <Button variant="contained" onClick={createNewFormRevision} data-cy="supplier-migration-upgrade-form">Upgrade Form</Button>
              </Box>
            </> }
            {
              !needToReviseForm && needToReleaseForm
              && <Typography variant="body1" className={classes.marginBottom}>
              A Form revision exists with an updated form schema, but needs to be approved and released. Kindly review it and once released, come back here to update the <b>Supplier</b> revisions.
              </Typography>
            }
            { !needToReviseForm && !needToReleaseForm && !scanDetails?.id && <>
              <Typography variant="body2" className={classes.marginBottom}>
                A Form revision exists with an updated form schema. Run a scan to fetch the supplier revisions that can be upgraded to the new form schema. <br /> (A Scan normally takes about 10 mins).
              </Typography>
              <Box className={classes.buttons}>
                <FBButton
                  label="Scan For Revisions"
                  dataCy="supplier-migration-scan"
                  onClick = {registerScanForRevisions} />
                {/* <Button variant="contained" onClick={registerScanForRevisions} data-cy="supplier-migration-scan">Scan For Revisions</Button> */}
              </Box>
            </>
            }
            { !needToReviseForm && !needToReleaseForm && scanDetails?.id && <>
              <Typography variant="body2" className={classes.marginBottom}>
                Review the eligible supplier list from below. The selected suppliers would be migrated to the updated form. <br /> Action indicates if a new revision would be created or the existing revision would be migrated. <br /> Refresh the list by running a new scan. (A Scan normally takes about 10 mins)
              </Typography>
              <Box className={cx(classes.buttons, classes.flexBoxColumn)}>
                {
                  [MIGRATION_STATUS_ENUM.IN_PROGRESS, MIGRATION_STATUS_ENUM.STARTED].includes(scanDetails.status)
                  && <FBButton
                    label="Cancel Current Scan"
                    dataCy="supplier-migration-scan-cancel"
                    onClick = {cancelScanForRevisions}
                    variant="outlined"
                    color="primary"
                  />
                }
                { scanDetails.status === MIGRATION_STATUS_ENUM.COMPLETED && <>
                  <FBButton
                    label="Scan For Revisions"
                    dataCy="supplier-migration-scan"
                    onClick = {registerScanForRevisions}
                    variant="outlined"
                    color="primary"
                  />
                  <DateTime
                    value={scanDetails.completedAt}
                    format={MomentFormats.BriefDateTime}
                    className={cx(classes.dateTimeLabel)}
                  />
                </> }
                { !scanDetails.completedAt && <span>In Progress</span> }
                {/* <Button variant="contained" onClick={registerScanForRevisions} data-cy="supplier-migration-scan">Scan For Revisions</Button> */}
              </Box>
            </>
            }
          </Box>
          { needToReviseForm && <Box className={classes.formSchemaPanel}>
            <SettingsPanel title="Updated Form Schema" onToggle={toggleFormSchema} expanded={isFormSchemaExpanded}>
              <div style={{ display: 'flex', alignItems: 'start', flexWrap: 'wrap', gap: '30px 12px' }}>
                {newFormSchema.map((schemaItem: any) => {
                  return (
                    // <p>{JSON.stringify(schemaItem)}</p>
                    <ReactJson src={schemaItem} collapsed={1} key={schemaItem.name} />
                  );
                })}
              </div>
            </SettingsPanel>
          </Box> }
          {
            scanDetails?.id
              && <RevsTable scanId={scanDetails.id} />
          }
        </Box>
        }
      </div>
    </Box>
  );
};

export default SupplierMigrationContainer;
