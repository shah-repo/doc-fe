import {
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

const ExportPDFInfo: React.FC = () => {
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
          <Typography data-cy="export-pdf-info" className={classes.primaryText}>
            <Text translation="share.downloading.started.popup.title" />
          </Typography>
        }
        secondary={
          <Typography
            data-cy="export-pdf-text"
            component="span"
            variant="body2"
            color="textPrimary"
            className={classes.secondaryText}
          >
            {/* <Link
              component="span"
              variant="button"
              id="export-pdf-link-text"
              className={classes.secondaryLinkText}
            >
              <span style={{ display: 'inline-block' }}>
                { props?.id }
                <div className={classes.blackDot} />
                <Text
                  translation="form.builder.header.rev"
                  values={{ revision: props?.revId }} />
              </span>
            </Link>{' '} */}
            <Text translation="share.downloading.popup.desc" />
          </Typography>
        }
        className={classes.listItemText}
      />
    </ListItem>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const closeButton = ({ closeToast }) => (
  <div id="eport-pdf-close" onClick={closeToast}>
    <CloseIcon />{' '}
  </div>
);

export const exportPDFInfoToastr = (myProps, options = {}) =>
  toast(<ExportPDFInfo {...myProps} />, {
    ...{
      toastId: 'docExportPDFToast',
      bodyClassName: 'docExportPDFToastBody',
      position: 'top-center',
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      transition: Slide,
      timeout: 0,
      extendedTimeout: 0,
      theme: 'Light',
      // closeButton,
    },
    ...options,
  });
