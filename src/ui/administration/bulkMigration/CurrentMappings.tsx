import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { IOption } from './interface';
import useStyles from './styles';

interface CurrentMappingsProps {
  localMapping: {[key: string]: IOption}
}

const CurrentMappings: React.FC<CurrentMappingsProps> = ({
  localMapping,
}) => {
  const classes = useStyles();

  return (
    <Box mt={2} display="flex" flexDirection="column" mx={3.5}>
      <Typography variant="h5" className={classes.marginBottom8}>Current Mappings</Typography>
      {Object.entries(localMapping).map(([from, to], index) => (
        <Typography key={index} variant="subtitle2">{from} {'->'} {to.text}</Typography>
      ))}
    </Box>
  );
};

export default CurrentMappings;
