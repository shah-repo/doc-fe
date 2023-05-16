import {
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Slide, toast } from 'react-toastify';
import { ReactComponent as CloseIcon } from '../../../assets/images/po_status_close.svg';
import { ReactComponent as InfoIcon } from '../../../assets/images/po_status_info.svg';
import Text from '../Text';
import POStatusToastrStyles from './POStatus.styles';
import './styles.css';

interface Props {
  id?: string;
  revId?: string;
}

const POToastr: React.FC<Props> = (props) => {
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
        primary={
          <Typography data-cy="po-status-info" className={classes.primaryText}>
            <Text translation="common.info" />
          </Typography>
        }
        secondary={
          <Typography
            data-cy="secondary-text"
            component="span"
            variant="body2"
            color="textPrimary"
            className={classes.secondaryText}
          >
            <Link
              component="span"
              variant="button"
              id="po-status-link-text"
              className={classes.secondaryLinkText}
            >
              <span style={{ display: 'inline-block' }}>
                { props?.id }
                <div className={classes.blackDot} />
                <Text
                  translation="form.builder.header.rev"
                  values={{ revision: props?.revId }}/>
              </span>
            </Link>{' '}
            <Text translation="documentRevision.po.reopen"/>
          </Typography>
        }
        className={classes.listItemText}
      />
    </ListItem>
  );
};

const closeButton = ({ closeToast }) => (
  <div id="poStatusCloseButton" onClick={closeToast}>{<CloseIcon />} </div>
);

export const openPOToastr = (myProps, options = {}) =>
  toast(<POToastr {...myProps} />, {
    ...{
      toastId: 'poStatusToast',
      bodyClassName: 'poStatusToastrBody',
      position: 'top-center',
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      transition: Slide,
      timeout: 0,
      extendedTimeout: 0,
      theme: 'Light',
      closeButton,
    },
    ...options,
  });
