import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
import AnnouncementDetail from './AnnouncementDetail';
import InfoIndicator from './InfoIndicator';
import { IAnnouncement, IAnnouncementDetail, IndicatorTypeEnum, SELECTED_RESOLUTION_ENUM } from './interface';
import useStyles from './styles';
import { useAnnouncementDetails } from './useAnnouncementDetails';
import { updateNestedObject } from './utils';

const AnnouncementDetailsDialog: React.FC<{
  isOpen: boolean
  handleClose: () => void
  announcement: IAnnouncement
}> = ({ isOpen, handleClose, announcement }) => {
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

  const [isAnyConflictingElementsUnResolved, setIsAnyConflictingElementsUnResolved] = useState<boolean>(false);

  useEffect(() => {
    if (announcement.id) {
      getAnnouncementDetails(announcement.id);
    }
  }, [announcement]);

  useEffect(() => {
    if (Object.keys(conflictingElements).length) {
      const isAnyUnresolved = Object.values(conflictingElements).some(
        (conflictingElement) => !conflictingElement.isResolved && conflictingElement.mustBeResolved,
      );
      setIsAnyConflictingElementsUnResolved(isAnyUnresolved);
    }
  }, [conflictingElements]);

  const handleConflictResolution = (detailRow: IAnnouncementDetail, value: SELECTED_RESOLUTION_ENUM) => {
    const updated = updateNestedObject(conflictingElements, detailRow.id, {
      isResolved: true,
      isSelected: value === SELECTED_RESOLUTION_ENUM.EXISTING,
    });
    setConflictingElements(updated);
  };

  const showUpgradeSection = announcement.canUpgradeForm;
  const showUpgradeSuccess = showUpgradeSection && isFormUpgradeDone;
  const showUpgradeInfo = !showUpgradeSection;
  const showUnresolvedWarning = showUpgradeSection && isAnyConflictingElementsUnResolved;

  return (
    <Dialog fullScreen open={isOpen} onClose={handleClose} aria-labelledby="announcement-detail-title">
      <AppBar className={classes.announceDetailsAppBar} color="default">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={3}>
            <Box>
              <Typography variant="h5">{announcement.name}</Typography>
            </Box>
          </Grid>

          <Grid item xs={8}>
            {showUpgradeSection && (
              <Box display="flex" alignItems="start" justifyContent="center" className={classes.conflictingElementBox}>
                {showUnresolvedWarning && (
                  <InfoIndicator
                    type={IndicatorTypeEnum.WARNING}
                    text={translate('supplier.announcement.details.upgrade.conflict.elements.unresolved.message')}
                  />
                )}

                <FormControl className={classes.upgradeSelectionFormControl}>
                  <Select
                    labelId="form-rev-upgrade-selector"
                    value={selectedFormRevToUpgrade}
                    onChange={(event) => handleFormRevSelectionToUpgrade(event.target.value as string, announcement.id)}
                  >
                    {formRevsList.map((formRev) => (
                      <MenuItem value={formRev.id} key={formRev.id}>
                        <em>
                          {formRev.document?.docId} • {formRev.name} • {formRev.displayRevision} •{' '}
                          {formRev.displayStatus}
                        </em>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {translate('supplier.announcement.details.upgrade.form.rev.helper.text')}
                  </FormHelperText>
                </FormControl>

                <Button
                  variant="outlined"
                  data-cy="upgrade-form"
                  onClick={() => processFormUpgrade(announcement.id)}
                  disabled={isAnyConflictingElementsUnResolved || !selectedFormRevToUpgrade}
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

          <Grid item xs={1} justify="flex-end">
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
