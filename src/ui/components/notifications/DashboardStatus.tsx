import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Slide, toast } from 'react-toastify';
import { ReactComponent as InfoIcon } from '../../../assets/images/po_status_info.svg';
import Text from '../Text';
import POStatusToastrStyles from './POStatus.styles';
import './styles.css';

const DashboardToastr: React.FC = () => {
  const classes = POStatusToastrStyles();
  return (
    <ListItem
      alignItems="flex-start"
      disableGutters
      className={classes.listItem}
    >
      <ListItemAvatar className={classes.infoIcon}>
        <InfoIcon />
      </ListItemAvatar>
      <ListItemText
        secondary={
          <Typography
            data-cy="secondary-text"
            component="span"
            variant="body2"
            color="textPrimary"
            className={classes.secondaryText}
          >
            <Text translation="dashboard.lineItems.status" />
          </Typography>
        }
        className={classes.listItemText}
      />
    </ListItem>
  );
};

export const openDashboardToastr = ( options = {}) =>
  toast(<DashboardToastr />, {
    ...{
      toastId: 'dashboardStatusToast',
      bodyClassName: 'dashboardStatusToastrBody',
      position: 'top-center',
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      transition: Slide,
      autoClose: 5000,
      closeButton: true,
    },
    ...options,
  });
