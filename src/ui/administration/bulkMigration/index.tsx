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
import { ListType, MIGRATION_STATUS_ENUM, SelectedItemDetails } from './interface';
import KendoRevsTable from './KendoRevsTable';
import MigrationConfirmationDialog from './MigrationConfirmation.dialog';
import MigrationMappingDialog from './MigrationMapping.dialog';
import useStyles from './styles';
import { useBulkMigration } from './useBulkMigration';
import { getRevById } from './utils';

const BulkMigrationContainer: React.FC = () => {
  const classes = useStyles();
  const [selectedRows, setSelectedRows] = useState<SelectedItemDetails[]>([]);
  const [isMigrationMappingDialogVisible, setIsMigrationMappingDialogVisible] = useState<boolean>(false);

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

  useEffect(() => {
    fetchAllDocumentTypes();
  }, []);

  const handleDocumentTypeChange = (value: string, fieldName: string) => {
    if (fieldName === 'fromDocumentTypeId') {
      setFromDocumentTypeId(value);
    } else if (fieldName === 'toDocumentTypeId') {
      setToDocumentTypeId(value);
    }
  };

  const handleFormRevSelection = (selectedFormRevId: string, fieldName: string) => {
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
  };

  const validateFormRevVersionNumbersAndStatus = (selectedFormRevId: string) => {
    let isValidated = true;

    if (fromDocumentTypeId === toDocumentTypeId) {
      const fromFormRev = getRevById(fromFormRevsList, fromFormRevId);
      const fromFormVersion = fromFormRev?.version ?? -1;
      const toFormRev = getRevById(toFormRevsList, selectedFormRevId);
      const toFormVersion = toFormRev?.version ?? -1;

      if (fromFormRev?.document.docId === toFormRev?.document.docId && toFormVersion <= fromFormVersion) {
        isValidated = false;
        toastError(translate('bulk.migration.higher.form.rev.error.message'));
      }
    }
    return isValidated;
  };

  const handleSelectedRowsChange = (selected: SelectedItemDetails[]) => {
    setSelectedRows(selected);
  };

  useEffect(() => {
    if (fromDocumentTypeId) {
      fetchFormRevsForDocumentType(fromDocumentTypeId, ListType.FROM);
    }
  }, [fromDocumentTypeId]);

  useEffect(() => {
    if (toDocumentTypeId) {
      fetchFormRevsForDocumentType(toDocumentTypeId, ListType.TO);
    }
  }, [toDocumentTypeId]);

  useEffect(() => {
    if (fromDocumentTypeId && toDocumentTypeId && fromFormRevId && toFormRevId) {
      registerScanForRevisions();
    }
  }, [fromDocumentTypeId, toDocumentTypeId, fromFormRevId, toFormRevId]);

  const showMappingRules = () => {
    setIsMigrationMappingDialogVisible(true);
  };

  const handleMigrationMappingDialogClose = () => {
    setIsMigrationMappingDialogVisible(false);
  };

  const fromRev = getRevById(fromFormRevsList, fromFormRevId);
  const toRev = getRevById(toFormRevsList, toFormRevId);
  const { status: scanStatus, id: scanId = '' } = scanDetails ?? {};

  const STATUSES_SHOWING_MIGRATION: MIGRATION_STATUS_ENUM[] = [
    MIGRATION_STATUS_ENUM.INITIALIZED,
    MIGRATION_STATUS_ENUM.CANCELLED,
    MIGRATION_STATUS_ENUM.FAILED,
    MIGRATION_STATUS_ENUM.COMPLETED,
  ];

  const STATUSES_SHOWING_ERROR: MIGRATION_STATUS_ENUM[] = [
    MIGRATION_STATUS_ENUM.FAILED,
    MIGRATION_STATUS_ENUM.COMPLETED,
  ];

  const STATUSES_ALLOWING_CANCEL: MIGRATION_STATUS_ENUM[] = [
    MIGRATION_STATUS_ENUM.IN_PROGRESS,
    MIGRATION_STATUS_ENUM.STARTED,
    MIGRATION_STATUS_ENUM.MAPPING,
  ];

  const status = scanStatus as MIGRATION_STATUS_ENUM;
  const isBulkMigrationButtonVisible = STATUSES_SHOWING_MIGRATION.includes(status);
  const isBulkMigrationErrorVisible = STATUSES_SHOWING_ERROR.includes(status);
  const isCancelMigrationButtonVisible = STATUSES_ALLOWING_CANCEL.includes(status);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h1" className={classes.title}>
              {translate('administration.bulk.migration.title')}
            </Typography>
            <Typography variant="subtitle1" className={classes.subtitle}>
              {translate('administration.bulk.migration.subtitle')}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {promptUserToRescanDetails.isPromptUserToScan && scanStatus !== MIGRATION_STATUS_ENUM.IN_PROGRESS && (
              <div className={classes.promptUserMsgStyle}>
                {translate('bulk.migration.re.scan.message', {
                  msgParts: promptUserToRescanDetails.msgParts.join(' '),
                })}
              </div>
            )}
          </Grid>
          <Grid item xs={2}>
            {selectedRows.length > 0 && (
              <Button
                size="small"
                data-cy="migrate-revisions-btn"
                onClick={confirmSubmission}
                variant="contained"
                color="primary"
              >
                {translate('bulk.migration.migrate.revisions')}
              </Button>
            )}
          </Grid>
        </Grid>
        {isLoading && <LinearProgress className={classes.progress} data-cy="saving-progress-bar" />}
        <Box className={classes.flexBox}>
          <Box className={classes.boxForSelection}>
            <Typography variant="h5" className={classes.migrateInfo}>
              {translate('bulk.migration.migrate.from')}
            </Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>
              {translate('bulk.migration.select.document.rev.info')}
            </Typography>

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
                    translate('bulk.migration.document.revision.options.label', {
                      docId: formRev.document?.docId,
                      name: formRev.name,
                      revision: formRev.displayRevision,
                      status: formRev.displayStatus,
                    })
                  }
                  data-cy="from-rev-selection"
                  value={fromFormRevsList.find((rev) => rev.id === fromFormRevId) || null}
                  onChange={(_, selectedOption) => handleFormRevSelection(selectedOption?.id || '', 'fromFormRevId')}
                />
              </FormControl>
            </Box>
            {fromDocumentTypeId && fromFormRevId && (
              <Box className={classes.revsTableRefreshBox}>
                <Typography
                  variant="subtitle2"
                  id="eligible-revs"
                  className={classes.revsTableRefreshText}
                  component="div"
                >
                  {translate('bulk.migration.eligible.revisions')} -{' '}
                  <span className={classes.blackSpan}> {eligibleRevsCount} </span>
                  <RefreshIcon
                    className={classes.revsTableRefreshIcon}
                    data-cy="refresh-eligible-revs"
                    onClick={(e) => fetchEligibleRevisionsOfRevType(fromFormRevId)}
                  />
                </Typography>
              </Box>
            )}
          </Box>

          <Box className={cx(classes.actionBox, classes.flexBoxColumn)}>
            {scanDetails?.id && (
              <Box className={cx(classes.buttons, classes.flexBoxColumn)}>
                {isCancelMigrationButtonVisible && (
                  <>
                    <Button
                      data-cy="supplier-migration-scan-cancel"
                      onClick={cancelScanForRevisions}
                      variant="contained"
                      color="primary"
                      size="small"
                      className={classes.zeroMarginBottom}
                    >
                      {translate('bulk.migration.cancel.current.scan')}
                    </Button>
                    <Box className={classes.revsTableRefreshBox}>
                      <Typography
                        variant="subtitle2"
                        id="scan-revs"
                        className={cx(classes.revsTableRefreshText, classes.blinking)}
                        component="div"
                      >
                        {scanStatus}
                        <RefreshIcon className={classes.revsTableRefreshIcon} onClick={getScanDetails} />
                      </Typography>
                    </Box>
                  </>
                )}

                {isBulkMigrationButtonVisible && (
                  <>
                    <Button
                      data-cy="bulk-migration-scan"
                      onClick={startRevisionsScan}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      {translate('bulk.migration.run.scan')}
                    </Button>
                    {isBulkMigrationErrorVisible && (
                      <span className={classes.dateTimeLabel}>
                        {scanStatus === MIGRATION_STATUS_ENUM.FAILED ? translate('bulk.migration.scan.fail.message') : null}
                        <DateTime value={scanDetails.completedAt} format={MomentFormats.BriefDateTime} />
                      </span>
                    )}
                  </>
                )}
              </Box>
            )}
            {toFormRevId && fromFormRevId && (
              <Button
                size="small"
                color="secondary"
                data-cy="show-mappings"
                variant="contained"
                onClick={showMappingRules}
              >
                {translate('bulk.migration.mapping.logic')}
              </Button>
            )}
          </Box>

          <Box className={classes.boxForSelection}>
            <Typography variant="h5" className={classes.migrateInfo}>
              {translate('bulk.migration.migrate.to')}
            </Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>
              {translate('bulk.migration.select.document.rev.info')}
            </Typography>

            <Box className={classes.innerBox}>
              <FormControl className={classes.formControl40}>
                <Autocomplete
                  options={documentTypesList}
                  getOptionLabel={(type) => `${type.documentTypeName} - ${type.documentTypeAcronym}`}
                  placeholder={translate('bulk.migration.document.type')}
                  data-cy="to-doc-type"
                  value={getRevById(documentTypesList, toDocumentTypeId) || null}
                  onChange={(_, selectedOption) =>
                    handleDocumentTypeChange(selectedOption?.id || '', 'toDocumentTypeId')
                  }
                />
              </FormControl>

              <FormControl className={classes.formControl60} id="form-rev-migrate-to">
                <Autocomplete
                  options={toFormRevsList}
                  getOptionLabel={(formRev) =>
                    translate('bulk.migration.document.revision.options.label', {
                      docId: formRev.document?.docId,
                      name: formRev.name,
                      revision: formRev.displayRevision,
                      status: formRev.displayStatus,
                    })
                  }
                  data-cy="to-rev-selection"
                  placeholder={translate('bulk.migration.document.form.rev.selection')}
                  value={toRev || null}
                  onChange={(_, selectedOption) => handleFormRevSelection(selectedOption?.id || '', 'toFormRevId')}
                />
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Box>
      <div className={classes.panels}>
        {!isEmpty(errorMessage) && <div className={classes.errMsgStyle}>{errorMessage}</div>}
        {scanDetails?.id && !isScanRunning && (
          <KendoRevsTable {...{ scanId, updateRevsTable, handleSelectedRowsChange }} />
        )}
        {scanDetails?.id && isScanRunning && (
          <Box className={classes.searchIconContainer}>
            <SearchIcon className={classes.searchIcon} />
          </Box>
        )}
      </div>
      {isMigrationMappingDialogVisible && fromFormRevId && toFormRevId && (
        <MigrationMappingDialog
          isOpen={isMigrationMappingDialogVisible}
          handleClose={handleMigrationMappingDialogClose}
          fromRev={fromRev}
          toRev={toRev}
          updateScanMapping={updateScanMapping}
          scanDetails={scanDetails}
        />
      )}
      {isConfirmationDialogVisible && (
        <MigrationConfirmationDialog
          isOpen={isConfirmationDialogVisible}
          handleClose={handleMigrationConfirmationDialogClose}
          selectedDetails={selectedRows}
          handleConfirmation={handleMigrationConfirmation}
          toDocumentTypeId={toDocumentTypeId}
          toFormRev={toRev}
        />
      )}
    </Box>
  );
};

export default BulkMigrationContainer;
