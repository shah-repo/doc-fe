import { AppBar, Box, Button, Dialog, DialogContent, Grid, IconButton, makeStyles, Popover, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import InfoIcon from '@material-ui/icons/Info';
import { AxiosRequestConfig } from 'axios';
import React, { useEffect, useState } from 'react';
import { intl } from '../../../common/intl';
import apiClient from '../../../state/apiClient';
import { ANNOUNCEMENTS_GET_DETAILS } from '../../../state/ducks/company/constants';
import { store } from '../../../state/store';
import { toastError } from '../../components/notifications';
import Colors from '../../layout/theme/utils/colors';
import AnnouncementDetail from './AnnouncementDetail';
import { IAnnouncement, IAnnouncementDetail } from './interface';

const useStyles = makeStyles((theme) => ({
  popoverPaper: {
    padding: theme.spacing(1),
    maxWidth: '400px',
    backgroundColor: Colors.medium_gray,
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

  const [announcementDetailRows, setAnnouncementDetailRows] = useState<IAnnouncementDetail[]>([]);

  // Popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleUpgradeFormPopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUpgradeFormPopoverClose = () => {
    setAnchorEl(null);
  };

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
      url: `${ANNOUNCEMENTS_GET_DETAILS}/${announcement.id}`,
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
        setAnnouncementDetailRows(data);
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
      <AppBar style={{ position: 'relative', padding: '8px 16px' }} color="default">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={7}>
            <Box>
              <Typography variant="h5">
                {announcement.name}
              </Typography>
              <Typography variant="subtitle2">
                {announcement.text}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box display="flex" style={{ gap: '4px' }} alignItems="center" justifyContent="center">
              <Button variant="outlined" data-cy="upgrade-form"> Upgrade Form </Button>
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
                <Typography variant="subtitle2" style={{ marginTop: '4px' }}>
                    A new Form revision would be created with combining these new elements with the existing schema.<i>This Rev would be created in Draft</i>.
                  <br /><br /> Kindly preview it, & make the necessary changes before approving & releasing it.
                </Typography>
              </Popover>
            </Box>
          </Grid>

          <Grid item xs={1} justify="center">
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>

        </Grid>
      </AppBar>
      <DialogContent >
        { isLoading
          && <Typography variant="h4" color="primary"> <HourglassFullIcon /> Loading.... </Typography> }
        {!isLoading && errorMessage
          && <div style={{ color: Colors.red, backgroundColor: Colors.light_red, padding: '4px' }}> {errorMessage}. </div>}
        {!isLoading && !errorMessage
          && <>
            <Typography style={{ marginBottom: '1em' }}>Below is a list of the fields, that will be added to the existing Form Schema.</Typography>
            <Grid container spacing={6}>
              {
                announcementDetailRows.map(announcementDetailRow => {
                  return (
                    <AnnouncementDetail announcementDetailRow={announcementDetailRow} key={announcementDetailRow.id} />
                  );
                })
              }
            </Grid>
          </>

        }
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDetailsDialog;
