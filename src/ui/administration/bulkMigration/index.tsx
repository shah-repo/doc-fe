/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, FormControl, Grid, LinearProgress, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
import { MomentFormats } from '../../../common/utils/date';
import DateTime from '../../components/DateTime';
import { Autocomplete, Button } from '../../components/forms/fields-next';
import { toastError } from '../../components/notifications';
import { FBButton } from '../../form.builder';
import { ISelectedDetails, MIGRATION_STATUS_ENUM } from './interface';
import MigrationConfirmationDialog from './MigrationConfirmation.dialog';
import MigrationMappingDialog from './MigrationMapping.dialog';
import RevsTable from './RevsTable';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';

const BulkMigrationContainer: React.FC = () => {
  const classes = useStyles();

  const {
    isLoading,
    isScanRunning,
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
    setEligibleRevsCount,
    promptUserToRescanDetails,
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

  useEffect(() => {
    fetchAllDocumentTypes();
  }, []);

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
      if (selectedFormRevId) {
        // Get the number of eligible formRevisions
        fetchEligibleRevisionsOfRevType(selectedFormRevId);
      } else {
        // When cleared
        setEligibleRevsCount(0);
      }
      setFromFormRevId(selectedFormRevId);
    }

    if (fieldName === 'toFormRevId' && selectedFormRevId) {
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
            {promptUserToRescanDetails.isPromptUserToScan && scanDetails?.status !== MIGRATION_STATUS_ENUM.IN_PROGRESS
              && <div className={classes.promptUserMsgStyle}>{`${promptUserToRescanDetails.msgParts.join(' ')}. Rerun scan to accommodate these changes.`}</div>
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
            <Typography variant="h5" className={classes.migrateInfo}> {translate('bulk.migration.migrate.from')} </Typography>
            <Typography variant="subtitle2" className={classes.subtitle}> {translate('bulk.migration.select.document.rev.info')} </Typography>

            <Box className={classes.innerBox}>
              <FormControl className={classes.formControl40} id="OwnerChangerPresenter-selectField">
                <Autocomplete
                  options={documentTypesList}
                  getOptionLabel={(type) => `${type.documentTypeName} - ${type.documentTypeAcronym}`}
                  placeholder={translate('bulk.migration.document.type')}
                  data-cy="from-doc-type"
                  value={documentTypesList.find((type) => type.id === fromDocumentTypeId) || null}
                  onChange={(_, selectedOption) =>
                    handleDocumentTypeChange(selectedOption?.id || '', 'fromDocumentTypeId')
                  }
                />
              </FormControl>
              <FormControl className={classes.formControl60}>
                <Autocomplete
                  options={fromFormRevsList}
                  placeholder={translate('bulk.migration.document.form.rev.selection')}
                  getOptionLabel={(formRev) =>
                    translate('bulk.migration.document.revision.options.label', { docId: formRev.document?.docId, name: formRev.name, revision: formRev.displayRevision, status: formRev.displayStatus })
                  }
                  value={fromFormRevsList.find((rev) => rev.id === fromFormRevId) || null}
                  onChange={(_, selectedOption) =>
                    handleFormRevSelection(selectedOption?.id || '', 'fromFormRevId')
                  }
                />
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
                {[MIGRATION_STATUS_ENUM.IN_PROGRESS, MIGRATION_STATUS_ENUM.STARTED, MIGRATION_STATUS_ENUM.MAPPING].includes(scanDetails.status) && (
                  <>
                    <FBButton
                      label="Cancel Current Scan"
                      dataCy="supplier-migration-scan-cancel"
                      onClick={cancelScanForRevisions}
                      variant="outlined"
                      color="primary"
                      className={classes.zeroMarginBottom}
                    />
                    <Box className={classes.revsTableRefreshBox}>
                      <Typography variant="subtitle2" id="scan-revs" className={cx(classes.revsTableRefreshText, classes.blinking)} component="div">
                        {scanDetails.status}
                        <RefreshIcon className={classes.revsTableRefreshIcon} onClick={getScanDetails} />
                      </Typography>
                    </Box>
                  </>
                )}

                {[MIGRATION_STATUS_ENUM.INITIALIZED, MIGRATION_STATUS_ENUM.CANCELLED, MIGRATION_STATUS_ENUM.FAILED, MIGRATION_STATUS_ENUM.COMPLETED].includes(scanDetails.status) && (
                  <>
                    <FBButton
                      label="Run Scan"
                      dataCy="bulk-migration-scan"
                      onClick={startRevisionsScan}
                      variant="outlined"
                      color="primary"
                    />
                    {[MIGRATION_STATUS_ENUM.FAILED, MIGRATION_STATUS_ENUM.COMPLETED].includes(scanDetails.status) && (
                      <span className={classes.dateTimeLabel}>
                        {scanDetails.status === MIGRATION_STATUS_ENUM.FAILED ? 'Last Failed at:' : null}
                        <DateTime
                          value={scanDetails.completedAt}
                          format={MomentFormats.BriefDateTime}
                        />
                      </span>
                    )}
                  </>
                )}
              </Box>
            )}
            {toFormRevId && fromFormRevId && (
              <Box> <Button color="inherit" variant="contained"onClick={showMappingRules}> {translate('bulk.migration.mapping.logic')} </Button> </Box>
            )}
          </Box>

          <Box className={classes.boxForSelection}>
            <Typography variant="h5" className={classes.migrateInfo}>{translate('bulk.migration.migrate.to')} </Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>{translate('bulk.migration.select.document.rev.info')}</Typography>

            <Box className={classes.innerBox}>
              <FormControl className={classes.formControl40}>
                <Autocomplete
                  options={documentTypesList}
                  getOptionLabel={(type) => `${type.documentTypeName} - ${type.documentTypeAcronym}`}
                  placeholder={translate('bulk.migration.document.type')}
                  data-cy="to-doc-type"
                  value={documentTypesList.find((type) => type.id === toDocumentTypeId) || null}
                  onChange={(_, selectedOption) =>
                    handleDocumentTypeChange(selectedOption?.id || '', 'toDocumentTypeId')
                  }
                />
              </FormControl>

              <FormControl className={classes.formControl60} id="form-rev-migrate-to">
                <Autocomplete
                  options={toFormRevsList}
                  getOptionLabel={(formRev) =>
                    translate('bulk.migration.document.revision.options.label', { docId: formRev.document?.docId, name: formRev.name, revision: formRev.displayRevision, status: formRev.displayStatus })
                  }
                  placeholder={translate('bulk.migration.document.form.rev.selection')}
                  value={toFormRevsList.find((rev) => rev.id === toFormRevId) || null}
                  onChange={(_, selectedOption) =>
                    handleFormRevSelection(selectedOption?.id || '', 'toFormRevId')
                  }
                />
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Box>
      <div className={classes.panels}>
        {!isEmpty(errorMessage) && (
          <div className={classes.errMsgStyle}>{errorMessage}</div>
        )}
        {scanDetails?.id && !isScanRunning && <Box>
          <RevsTable scanId={scanDetails.id} handleSelectedRowsChange={handleSelectedRowsChange} updateRevsTable={updateRevsTable} />
        </Box>
        }
        {scanDetails?.id && isScanRunning && <Box className={classes.searchIconContainer}>
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
