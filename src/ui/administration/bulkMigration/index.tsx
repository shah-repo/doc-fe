/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Select, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { translate } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import DateTime from '../../components/DateTime';
import { toastError } from '../../components/notifications';
import { FBButton } from '../../form.builder';
import { INTERVAL_DURATION, ISelectedDetails, MIGRATION_STATUS_ENUM } from './interface';
import MigrationConfirmationDialog from './MigrationConfirmation.dialog';
import MigrationMappingDialog from './MigrationMapping.dialog';
import RevsTable from './RevsTable';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';

const BulkMigrationContainer: React.FC = () => {
  const classes = useStyles();

  const {
    isLoading,
    errorMessage,
    documentTypesList,
    fromFormRevsList,
    toFormRevsList,
    fromDocumentTypeId,
    fromFormRevId,
    toDocumentTypeId,
    toFormRevId,
    setFromDocumentTypeId,
    setFromFormRevId,
    setToDocumentTypeId,
    setToFormRevId,
    eligibleRevsCount,
    rerunScanDetails,
    updateRevsTable,
    scanDetails,
    isConfirmationDialogVisible,
    fetchAllDocumentTypes,
    fetchFormRevsForDocumentType,
    fetchEligibleRevisionsOfRevType,
    registerScanForRevisions,
    getScanDetails,
    startRevisionsScan,
    updateScanMapping,
    cancelScanForRevisions,
    handleMigrationConfirmation,
    confirmSubmission,
    handleMigrationConfirmationDialogClose,
  } = useBulkMigration();

  const [selectedRows, setSelectedRows] = useState<ISelectedDetails[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Reference to store the interval ID.

  useEffect(() => {
    fetchAllDocumentTypes();
  }, []);

  useEffect(() => {
    if (scanDetails?.status === MIGRATION_STATUS_ENUM.STARTED || scanDetails?.status === MIGRATION_STATUS_ENUM.IN_PROGRESS) {
      intervalRef.current = setInterval(() => {
        getScanDetails();
      }, INTERVAL_DURATION);
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
  const [isMigrationMappingDialogVisible, setIsMigrationMappingDialogVisible] = useState<boolean>(false);
  const showMappingRules = () => {
    setIsMigrationMappingDialogVisible(true);
  };

  const handleMigrationMappingDialogClose = () => {
    setIsMigrationMappingDialogVisible(false);
  };

  const promptUserToRerunScan = () => {
    const msgParts: string[] = [];
    if (rerunScanDetails.irrelevantRevsCount > 0) {
      msgParts.push(`resolve ${rerunScanDetails.irrelevantRevsCount}`);
    }

    if (rerunScanDetails.newRevsCount > 0) {
      msgParts.push(`include ${rerunScanDetails.newRevsCount} new revisions`);
    }

    return `Please rerun scan to ${msgParts.join(' and ')}`;
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box>
              <Typography variant="h1" className={classes.title}>
                {translate('administration.bulk.migration.title')}
              </Typography>
              <Typography variant="subtitle1" className={classes.subtitle}>
                {translate('administration.bulk.migration.subtitle')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {(rerunScanDetails.newRevsCount > 0 || rerunScanDetails.irrelevantRevsCount > 0) && scanDetails?.status !== MIGRATION_STATUS_ENUM.IN_PROGRESS
              && <div className={classes.promptUserMsgStyle}>{promptUserToRerunScan()}</div>
            }
          </Grid>
          <Grid item xs={2}>
            { selectedRows.length > 0 && <FBButton
              label="Migrate Revisions"
              dataCy="migrate-revisions-btn"
              onClick = {confirmSubmission}
              variant="contained"
              color="primary"
            /> }
          </Grid>
        </Grid>
        {isLoading && (
          <LinearProgress
            className={classes.progress}
            data-cy="saving-progress-bar"
          />
        )}
        <Box className={classes.flexBox}>
          <Box className={classes.boxForSelection}>
            <Typography variant="h5" className={classes.migrateInfo}> Migrate From </Typography>
            <Typography variant="subtitle2" className={classes.subtitle}> Select the Document Type & Form Rev </Typography>

            <Box className={classes.innerBox}>
              <FormControl
                className={classes.formControl40}
              >
                <InputLabel id="document-type-migrate-from" className={classes.subtitle}> Document Type </InputLabel>
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
                    <MenuItem value={type.id} key={type.id} className={classes.subtitle}>
                      <span>
                        {type.documentTypeName} - {type.documentTypeAcronym}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText> */}
              </FormControl>

              <FormControl
                className={classes.formControl60}
              >
                <InputLabel id="form-rev-migrate-from" className={classes.subtitle}> Form Rev Selection </InputLabel>
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
                    <MenuItem value={formRev.id} key={formRev.id} className={classes.subtitle}>
                      <span>
                        {formRev.document?.docId} • {formRev.name} •{' '}
                        {formRev.displayRevision} • {formRev.displayStatus}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText> */}
              </FormControl>
            </Box>
            {fromDocumentTypeId && fromFormRevId && (
              <Box className={classes.revsTableRefreshBox}>
                <Typography variant="subtitle2" id="eligible-revs" className={classes.revsTableRefreshText} component="div">
                        Eligible Revisions - <span className={classes.blackSpan}> {eligibleRevsCount} </span>
                  <RefreshIcon
                    className={classes.revsTableRefreshIcon}
                    onClick={e => fetchEligibleRevisionsOfRevType(fromFormRevId)}
                  />
                </Typography>
              </Box>
            )}
          </Box>

          <Box className={cx(classes.actionBox, classes.flexBoxColumn)}>
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
                      className={classes.zeroMarginBottom}
                    />
                    <Typography variant="caption" className={classes.blinking}>{scanDetails.status}
                      <RefreshIcon className={classes.refreshIconStyle} onClick={getScanDetails} />
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
            <Typography variant="h5" className={classes.migrateInfo}>Migrate To</Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>Select the Document Type & Form Rev</Typography>

            <Box className={classes.innerBox}>
              <FormControl
                className={classes.formControl40}
              >
                <InputLabel id="document-type-migrate-to" className={classes.subtitle}> Document Type </InputLabel>
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
                    <MenuItem value={type.id} key={type.id} className={classes.subtitle}>
                      <span>
                        {type.documentTypeName} - {type.documentTypeAcronym}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>Some important helper text</FormHelperText> */}
              </FormControl>

              <FormControl
                className={classes.formControl60}
              >
                <InputLabel id="form-rev-migrate-to" className={classes.subtitle}> Form Rev Selection </InputLabel>
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
                    <MenuItem value={formRev.id} key={formRev.id} className={classes.subtitle}>
                      <span>
                        {formRev.document?.docId} • {formRev.name} •{' '}
                        {formRev.displayRevision} • {formRev.displayStatus}
                      </span>
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
          <div className={classes.errMsgStyle}>{errorMessage}</div>
        )}
        {scanDetails?.id && ![MIGRATION_STATUS_ENUM.STARTED, MIGRATION_STATUS_ENUM.IN_PROGRESS].includes(scanDetails?.status)
          && <Box>
            <RevsTable scanId={scanDetails.id} handleSelectedRowsChange={handleSelectedRowsChange} updateRevsTable={updateRevsTable} />
          </Box>
        }
        {scanDetails?.id && [MIGRATION_STATUS_ENUM.STARTED, MIGRATION_STATUS_ENUM.IN_PROGRESS].includes(scanDetails?.status)
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
