import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../common/intl';
import useStyles from './styles';

interface WarningCellProps {
  documentNumber: string
  onClick?: () => void
}

const WarningCell: React.FC<WarningCellProps> = ({
  documentNumber,
  onClick,
}) => {
  const classes = useStyles();
  const title = translate('lhr.summary.record.does.not.exist.error.message', {
    document: documentNumber,
  });

  return (
    <Tooltip title={title} placement="top" arrow>
      <Box className={classes.container} onClick={onClick}>
        <Typography className={classes.textBlock}>{documentNumber}</Typography>
        <FontAwesomeIcon
          icon={regular('triangle-exclamation')}
          className={classes.errorIcon}
        />
      </Box>
    </Tooltip>
  );
};

export default WarningCell;
