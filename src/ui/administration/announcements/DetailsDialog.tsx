import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
import { Autocomplete, Button } from '../../components/forms/fields-next';
import AnnouncementDetail from './Detail';
import InfoIndicator from './InfoIndicator';
import { Announcement, AnnouncementRowDetail, IndicatorTypeEnum, SelectedResolution } from './interface';
import useStyles from './styles';
import { useAnnouncementDetails } from './useDetails';
import { updateNestedObject } from './utils';

interface AnnouncementDetailsDialogProps {
  isOpened: boolean
  handleClose: () => void
  announcement: Announcement
}

const AnnouncementDetailsDialog: React.FC<AnnouncementDetailsDialogProps> = ({
  isOpened,
  handleClose,
  announcement,
}) => {
  const classes = useStyles();

  const {
    isLoading,
    errorMessage,
    isSubmitting,
    announcementDetailRows,
    formRevsList,
    isFormUpgradeDone,
    selectedFormRevToUpgrade,
    conflictingElements,
    setConflictingElements,
    getAnnouncementDetails,
    handleFormRevSelectionToUpgrade,
    processFormUpgrade,
  } = useAnnouncementDetails();

  const [hasUnresolvedConflicts, setHasUnresolvedConflicts] = useState<boolean>(false);

  useEffect(() => {
    if (announcement.id) {
      getAnnouncementDetails(announcement.id);
    }
  }, [announcement]);

  useEffect(() => {
    const values = Object.values(conflictingElements);
    const hasUnresolved = values?.some(({ isResolved, mustBeResolved }) => !isResolved && mustBeResolved);
    setHasUnresolvedConflicts(hasUnresolved);
  }, [conflictingElements]);

  const handleConflictResolution = (detailRow: AnnouncementRowDetail, value: SelectedResolution) => {
    const updated = updateNestedObject(conflictingElements, detailRow.id, {
      isResolved: true,
      isSelected: value === SelectedResolution.EXISTING,
    });
    setConflictingElements(updated);
  };

  const handleFormRevSelectionChanged = (selectedOption) => {
    const idSelected = selectedOption?.id;
    if (idSelected) {
      handleFormRevSelectionToUpgrade(idSelected, announcement.id);
    }
  };

  const showUpgradeSection = announcement.canUpgradeForm;
  const showUpgradeSuccess = showUpgradeSection && isFormUpgradeDone;
  const showUpgradeInfo = !showUpgradeSection;
  const showUnresolvedWarning = showUpgradeSection && hasUnresolvedConflicts;
  const disableUpgradeForm = hasUnresolvedConflicts || !selectedFormRevToUpgrade || isFormUpgradeDone;

  return (
    <Dialog fullScreen open={isOpened} onClose={handleClose} aria-labelledby="announcement-detail-title">
      <AppBar className={classes.announceDetailsAppBar} color="default">
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={3}>
            <Typography variant="h5">{announcement.name}</Typography>
          </Grid>

          <Grid item xs={8}>
            {showUpgradeSection && (
              <Box display="flex" alignItems="start" justifyContent="center" className={classes.conflictingElementBox}>
                {showUnresolvedWarning && !isFormUpgradeDone && (
                  <InfoIndicator
                    type={IndicatorTypeEnum.WARNING}
                    text={translate('supplier.announcement.details.upgrade.conflict.elements.unresolved.message')}
                  />
                )}

                <FormControl className={classes.upgradeSelectionFormControl}>
                  <Autocomplete
                    options={formRevsList}
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
                    value={formRevsList.find((rev) => rev.id === selectedFormRevToUpgrade) || null}
                    onChange={(_, selectedOption) => handleFormRevSelectionChanged(selectedOption)}
                  />
                  <FormHelperText>
                    {translate('supplier.announcement.details.upgrade.form.rev.helper.text')}
                  </FormHelperText>
                </FormControl>
                <Box className={classes.upgradeFormButtonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    data-cy="upgrade-form"
                    className={classes.upgradeFormButton}
                    onClick={() => processFormUpgrade(announcement.id)}
                    disabled={disableUpgradeForm}
                  >
                    {translate(
                      isSubmitting
                        ? 'supplier.announcement.details.upgrade.form.rev'
                        : 'supplier.announcement.details.upgrade.form',
                    )}
                  </Button>
                  <InfoIndicator
                    type={IndicatorTypeEnum.INFO}
                    text={translate('supplier.announcement.details.upgrade.message')}
                  />
                </Box>
              </Box>
            )}
            {showUpgradeInfo && (
              <div className={classes.infoDiv}> {translate('supplier.announcement.details.upgrade.info.message')}</div>
            )}
            {showUpgradeSuccess && (
              <div className={classes.infoDiv}>
                {translate('supplier.announcement.details.upgrade.success.message')}{' '}
                {announcement.isMappingRequired && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate('supplier.announcement.details.upgrade.mapping.message'),
                    }}
                  />
                )}
              </div>
            )}
          </Grid>

          <Grid item xs="auto" justify="flex-end">
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </AppBar>
      <DialogContent>
        {isLoading && (
          <Typography variant="h4" color="primary">
            <HourglassFullIcon /> {translate('common.loading')}
          </Typography>
        )}
        {!isLoading && errorMessage && <div className={classes.errorDiv}> {errorMessage}. </div>}
        {!isLoading && (
          <>
            <Typography className={classes.infoText}>
              {translate('supplier.announcement.details.info.message')}
            </Typography>
            <Grid container spacing={6}>
              {announcementDetailRows.map((announcementDetailRow) => {
                return (
                  <AnnouncementDetail
                    key={announcementDetailRow.id}
                    announcementDetailRow={announcementDetailRow}
                    conflictingElements={conflictingElements}
                    handleConflictResolution={handleConflictResolution}
                  />
                );
              })}
            </Grid>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDetailsDialog;
