import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import React from 'react';
import Text from '../Text';
import { exportPDFToastrStyles } from './ExportPDFToastr.styles';

export const ExportPDFToastr: React.FC = () => {
  const classes = exportPDFToastrStyles();

  return (
    <>
      <FontAwesomeIcon icon={regular('circle-info')} size="xl" className={classes.popupInfoIcon} />
      <Box>
        <Typography
          variant="h5"
          component="h5"
          className={classes.popupTitle}
        >
          <Text translation="share.downloading.started.popup.title" />
        </Typography>
        <Typography
          variant="subtitle2"
          component="span"
        >
          <Text translation="share.downloading.popup.desc" />
        </Typography>
      </Box>
    </>
  );
};
