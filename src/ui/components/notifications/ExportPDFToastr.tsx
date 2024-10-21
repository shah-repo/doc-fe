import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import copy from 'copy-to-clipboard';
import React from 'react';
import Text from '../Text';
import { exportPDFToastrStyles } from './ExportPDFToastr.styles';

export const ExportPDFToastr: React.FC = () => {
  const classes = exportPDFToastrStyles();

  return (
    <>
      <FontAwesomeIcon
        icon={regular('circle-info')}
        size="xl"
        className={classes.popupInfoIcon}
      />
      <Box>
        <Typography variant="h5" component="h5" className={classes.popupTitle}>
          <Text translation="share.downloading.started.popup.title" />
        </Typography>
        <Typography variant="subtitle2" component="span">
          <Text translation="share.downloading.popup.desc" />
        </Typography>
      </Box>
    </>
  );
};

export const ExportPDFCloseButton = ({ closeToast, linkInfo }) => {
  const classes = exportPDFToastrStyles();

  const copyLinkAddress = (event) => {
    event.stopPropagation();
    try {
      const parsedData = JSON.parse(linkInfo);
      const messageData = parsedData?.data?.message;
      const parsedMessage
        = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
      const link = parsedMessage?.url;
      if (link) {
        copy(link);
      }
    } catch (error) {
      console.error('An error occurred during the link copy', error);
    }
  };

  return (
    <Box
      data-cy="export-pdf-close"
      id="export-pdf-close"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box display="flex" justifyContent="flex-end">
        <FontAwesomeIcon
          icon={regular('xmark')}
          data-cy="copy-link"
          onClick={closeToast}
          className={classes.closeIcon}
        />
      </Box>
      <Box className={classes.closeText}>
        <span onClick={copyLinkAddress}>
          <Text translation="share.copy.link" />
        </span>
      </Box>
    </Box>
  );
};
