import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { toastSuccess } from '.';
import Text from '../Text';
import styles from './ExportPDFToastr.styles';

const ExportPDFToastr = () => {
  const classes = styles();

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

export const showExportPDFToastr = () => {
  const classes = styles();

  toastSuccess(<ExportPDFToastr />, {
    className: classes.popup,
    bodyClassName: classes.popupBody,
    progressClassName: 'progressClassName',
  });
};
