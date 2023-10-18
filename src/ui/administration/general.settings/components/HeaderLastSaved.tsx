import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, CircularProgress, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import { getHumanizedFormat } from '../../../../common/utils/date';
import { Colors } from '../../../layout/theme-next';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    lineHeight: 1.25,
    color: Colors.textBlack,
  },
  icon: {
    marginRight: theme.spacing(1),
    color: Colors.primaryLight,
  },
}));

interface Props {
  timestamp: string
  loading?: boolean
  updateInterval?: number
}

const HeaderLastSaved: React.FC<Props> = ({
  loading,
  timestamp,
  updateInterval = 60,
}) => {
  const classes = useStyles();
  const [, setTime] = useState(Date.now());
  const lastSavedTimestamp = getHumanizedFormat(timestamp);
  const updateIntervalMs = updateInterval * 1000;

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), updateIntervalMs);
    return () => {
      clearInterval(interval);
    };
  }, [updateIntervalMs]);

  return (
    <Box className={classes.root}>
      {loading ? (
        <>
          <CircularProgress color="inherit" size={12} className={classes.icon} />
          <Box data-cy="header-autosaving">
            {translate('form.builder.header.autoSaving')}
          </Box>
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={solid('cloud-check')} className={classes.icon} />
          <Box data-cy="header-last-saved">
            {translate('form.builder.header.lastSaved', { lastSavedTimestamp })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default HeaderLastSaved;
