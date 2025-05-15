import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import { LocalMappingOption } from './interface';
import useStyles from './styles';

interface CurrentMappingsProps {
  localMapping: LocalMappingOption
}

const CurrentMappings: React.FC<CurrentMappingsProps> = ({ localMapping }) => {
  const classes = useStyles();

  return (
    <Box className={classes.currentMappingsContainer}>
      <Typography variant="h5" className={classes.marginBottom8}>
        {translate('bulk.migration.current.mappings')}
      </Typography>
      {Object.entries(localMapping).map(([from, to], index) => (
        <Typography key={index} variant="subtitle2">
          {from} {'->'} {to.text}
        </Typography>
      ))}
    </Box>
  );
};

export default CurrentMappings;
