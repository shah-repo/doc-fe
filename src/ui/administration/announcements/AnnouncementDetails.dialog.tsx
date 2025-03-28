import { AppBar, Box, Button, Dialog, DialogContent, FormControl, FormHelperText, Grid, IconButton, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import { AxiosRequestConfig } from 'axios';
import React, { useEffect, useState } from 'react';
import { intl } from '../../../common/intl';
import apiClient from '../../../state/apiClient';
import { ANNOUNCEMENTS_BASE } from '../../../state/ducks/company/constants';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { store } from '../../../state/store';
import { toastError, toastSuccess } from '../../components/notifications';
import Colors from '../../layout/theme/utils/colors';
import AnnouncementDetail from './AnnouncementDetail';
import InfoIndicator from './InfoIndicator';
import { IAnnouncement, IAnnouncementDetail, IConflictingItem, IndicatorTypeEnum, SELECTED_RESOLUTION_ENUM } from './interface';
import { updateNestedObject } from './utils';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    padding: '8px 16px',
  },
  errorDiv: {
    color: Colors.red,
    backgroundColor: Colors.light_red,
    padding: '4px',
  },
  infoDiv: {
    color: Colors.blue,
    backgroundColor: Colors.light_gray_blue,
    padding: '4px 8px',
  },
  formControl: {
    width: '400px',
  },
}));

const AnnouncementDetailsDialog: React.FC<{
  isOpen: boolean
  handleClose: () => void
  announcement: IAnnouncement
}> = ({ isOpen, handleClose, announcement }) => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formRevsList, setFormRevsList] = useState<DocumentRevision[]>([]);
  const [selectedFormRevToUpgrade, setSelectedFormRevToUpgrade] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [announcementDetailRows, setAnnouncementDetailRows] = useState<IAnnouncementDetail[]>([]);
  const [conflictingElementsMap, setConflictingElementsMap] = useState<{ [key: string]: IConflictingItem }>({});
  const [isFormUpgradeDone, setIsFormUpgradeDone] = useState<boolean>(false);

  const [isAnyConflictingElementsUnResolved, setIsAnyConflictingElementsUnResolved] = useState<boolean>(false);

  function catchAxiosException (exception: any) {
    setIsLoading(false);
    if (exception?.response?.status === 504) {
      setErrorMessage(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
    } else {
      toastError(exception?.response.data?.message);
      setErrorMessage(exception?.response.data?.message);
    }
  }

  useEffect(() => {
    if (announcement.id) {
      getAnnouncementDetails();
    }
  }, [announcement]);

  function getAnnouncementDetails () {
    setIsLoading(true);
    setErrorMessage('');

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${ANNOUNCEMENTS_BASE}/${announcement.id}/details`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      // cancelToken: call.token,
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        const { announcementActionEntries, formRevs } = data as {
          announcementActionEntries: IAnnouncementDetail[]
          formRevs: DocumentRevision[]
        };
        setIsLoading(false);
        setAnnouncementDetailRows(announcementActionEntries);
        setFormRevsList(formRevs);
      })
      .catch((exception) => {
        console.log(exception);
        catchAxiosException(exception);
      });
  }

  function handleFormRevSelectionToUpgrade (revIdSelected: string) {
    setIsLoading(true);
    setErrorMessage('');

    setSelectedFormRevToUpgrade(revIdSelected);

    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${ANNOUNCEMENTS_BASE}/${announcement.id}/${revIdSelected}/details`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        const { conflictingElementsMap, isFormUpgradeDone } = data as {
          conflictingElementsMap: { [key: string]: IConflictingItem }
          isFormUpgradeDone: boolean
        };
        setIsLoading(false);
        setConflictingElementsMap(conflictingElementsMap);
        setIsFormUpgradeDone(isFormUpgradeDone ?? false);
      })
      .catch((exception) => {
        console.log(exception);
        catchAxiosException(exception);
      });
  }

  useEffect(() => {
    if (Object.keys(conflictingElementsMap).length) {
      const isAnyUnresolved = Object.values(conflictingElementsMap).some(conflictingElement => !conflictingElement.isResolved);
      setIsAnyConflictingElementsUnResolved(isAnyUnresolved);
    }
  }, [conflictingElementsMap]);

  function handleConflictResolution (announcementDetailRow: IAnnouncementDetail, value: SELECTED_RESOLUTION_ENUM) {
    const modifiedMap = updateNestedObject(conflictingElementsMap, announcementDetailRow.id, {
      isResolved: true,
      isSelected: value === SELECTED_RESOLUTION_ENUM.EXISTING,
    });
    setConflictingElementsMap(modifiedMap);
  }

  function processFormUpgrade () {
    const isAnyUnresolved = Object.values(conflictingElementsMap).some(conflictingElement => !conflictingElement.isResolved);
    if (isAnyUnresolved) {
      toastError('Please resolve all conflicts, before proceeding');
      return;
    }

    if (isSubmitting) {
      return;
    }

    if (!selectedFormRevToUpgrade) {
      return;
    }

    setIsSubmitting(true);

    const requestConfig: AxiosRequestConfig = {
      method: 'post',
      url: `${ANNOUNCEMENTS_BASE}/${announcement.id}/${selectedFormRevToUpgrade}/formUpgrade`,
      headers: {
        Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
      },
      data: {
        conflictingElementsMap,
      },
    };
    apiClient
      .request(requestConfig)
      .then((resp) => resp)
      .then(({ data }) => {
        setIsSubmitting(false);
        toastSuccess(
          `Form has been upgraded to Rev ${data.formRev?.displayRevision} . Please review and approve for next steps.`,
        );
      })
      .catch((exception) => {
        console.log(exception);
        catchAxiosException(exception);
      });
  }

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="announcement-detail-title"
    >
      <AppBar className={classes.appBar} color="default">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={3}>
            <Box>
              <Typography variant="h5">
                {announcement.name}
              </Typography>
              {/* <Typography variant="subtitle2">
                {announcement.text}
              </Typography> */}
            </Box>
          </Grid>

          <Grid item xs={8}>
            { announcement.canUpgradeForm
            && <Box display="flex" style={{ gap: '6px' }} alignItems="start" justifyContent="center">
              {isAnyConflictingElementsUnResolved && <InfoIndicator
                type={IndicatorTypeEnum.WARNING}
                text="The new set of options do not match the current number of options for certain existing elements. <br />This might cause inconsistencies & result in data loss. <br /><br />Please review and resolve the mismatch before proceeding." />}

              <FormControl
                className={classes.formControl}
              >
                <Select
                  labelId="form-rev-upgrade-selector"
                  value={selectedFormRevToUpgrade}
                  onChange={(event) => handleFormRevSelectionToUpgrade(event.target.value as string)
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

              <Button variant="outlined" data-cy="upgrade-form" onClick={processFormUpgrade}
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
          <Typography style={{ marginBottom: '1em' }}>Below is a list of the fields, that will be added to the existing Form Schema. A preview of the components has been added.</Typography>
          <Grid container spacing={6}>
            {
              announcementDetailRows.map(announcementDetailRow => {
                return (
                  <AnnouncementDetail key={announcementDetailRow.id}
                    announcementDetailRow={announcementDetailRow}
                    conflictingElementsMap={conflictingElementsMap}
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
