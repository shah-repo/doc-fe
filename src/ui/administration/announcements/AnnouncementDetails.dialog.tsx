import { AppBar, Box, Button, Dialog, DialogContent, FormControl, FormHelperText, Grid, IconButton, MenuItem, Select, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import React, { useEffect, useState } from 'react';
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
      const isAnyUnresolved = Object.values(conflictingElements)
        .some(conflictingElement => !conflictingElement.isResolved && conflictingElement.mustBeResolved);
      setIsAnyConflictingElementsUnResolved(isAnyUnresolved);
    }
  }, [conflictingElements]);

  function handleConflictResolution (announcementDetailRow: IAnnouncementDetail, value: SELECTED_RESOLUTION_ENUM) {
    const modifiedMap = updateNestedObject(conflictingElements, announcementDetailRow.id, {
      isResolved: true,
      isSelected: value === SELECTED_RESOLUTION_ENUM.EXISTING,
    });
    setConflictingElements(modifiedMap);
  }

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="announcement-detail-title"
    >
      <AppBar className={classes.announceDetailsAppBar} color="default">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={3}>
            <Box>
              <Typography variant="h5">
                {announcement.name}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={8}>
            { announcement.canUpgradeForm
            && <Box display="flex" alignItems="start" justifyContent="center" className={classes.conflictingElementBox}>
              {isAnyConflictingElementsUnResolved && <InfoIndicator
                type={IndicatorTypeEnum.WARNING}
                text="The new set of options do not match the current number of options for certain existing elements. <br />This might cause inconsistencies & result in data loss. <br /><br />Please review and resolve the mismatch before proceeding." />}

              <FormControl
                className={classes.upgradeSelectionFormControl}
              >
                <Select
                  labelId="form-rev-upgrade-selector"
                  value={selectedFormRevToUpgrade}
                  onChange={(event) => handleFormRevSelectionToUpgrade(event.target.value as string, announcement.id)
                  }
                >
                  {formRevsList.map((formRev) => (
                    <MenuItem value={formRev.id} key={formRev.id}>
                      <em>
                        {formRev.document?.docId} • {formRev.name} • {formRev.displayRevision} • {formRev.displayStatus}
                      </em>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select form rev to upgrade</FormHelperText>
              </FormControl>

              <Button variant="outlined" data-cy="upgrade-form" onClick={e => processFormUpgrade(announcement.id)}
                disabled={isAnyConflictingElementsUnResolved || !selectedFormRevToUpgrade}> { isSubmitting ? 'Upgrading Form Rev' : 'Upgrade Form' } </Button>
              <InfoIndicator
                type={IndicatorTypeEnum.INFO}
                text={`A new Form revision would be created with combining these new elements with the existing schema.This Rev would be created in Draft.
              <br /><br /> Kindly preview it, make the necessary changes before approving and releasing it. <br /><br /> Once created, please use <b>Bulk Migration</b> to select this revision, set up <b>Mapping Rules</b> and preview the changes.`} />
            </Box>
            }
            { !announcement.canUpgradeForm
              && <div className={classes.infoDiv}> Talk to your Admin Or Form Owner to upgrade.</div>
            }
            { announcement.canUpgradeForm && isFormUpgradeDone
              && <div className={classes.infoDiv}> Form has been upgraded with the newer elements. {announcement.isMappingRequired && <span>Please use <b>Bulk Migration</b> to select this revision, set up <b>Mapping Rules</b> and preview the changes.</span>} </div>
            }
          </Grid>

          <Grid item xs={1} justify="flex-end">
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </AppBar>
      <DialogContent >
        {isLoading
          && <Typography variant="h4" color="primary"> <HourglassFullIcon /> Loading.... </Typography>}
        {!isLoading && errorMessage
          && <div className={classes.errorDiv}> {errorMessage}. </div>}
        {!isLoading && <>
          <Typography className={classes.infoText}>Below is a list of the fields, that will be added to the existing Form Schema. A preview of the components has been added.</Typography>
          <Grid container spacing={6}>
            {
              announcementDetailRows.map(announcementDetailRow => {
                return (
                  <AnnouncementDetail key={announcementDetailRow.id}
                    announcementDetailRow={announcementDetailRow}
                    conflictingElements={conflictingElements}
                    handleConflictResolution={handleConflictResolution}
                  />
                );
              })
            }
          </Grid>
        </>}
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDetailsDialog;
