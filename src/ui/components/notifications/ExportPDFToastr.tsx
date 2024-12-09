import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip, Typography } from '@material-ui/core';
import cx from 'classnames';
import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
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
          <Text translation="share.download.popup.title" />
        </Typography>
        <Typography variant="subtitle2" component="span">
          <Text translation="share.download.popup.desc" />
        </Typography>
      </Box>
    </>
  );
};

export const ExportPDFCloseButton = ({ closeToast, linkInfo }) => {
  const classes = exportPDFToastrStyles();
  const [isCopied, setIsCopied] = useState(false);

  const copyLinkAddress = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    if (linkInfo) {
      copy(linkInfo);
      setIsCopied(true);
    }
  };

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

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
        <Tooltip
          placement="top"
          title={translate('share.copy.link.copied')}
          open={isCopied}
          PopperProps={{ className: cx('MuiTooltip-popper MuiTooltip-popperArrow', classes.tooltip) }}
          arrow
        >
          <span className={cx({ [classes.disabledText]: isCopied })} onClick={copyLinkAddress}>
            <Text translation="share.copy.link" />
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};
