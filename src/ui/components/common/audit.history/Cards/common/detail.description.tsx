
import { Box } from '@material-ui/core';
import React from 'react';
import Colors from '../../../../../layout/theme/utils/colors';
import styles from './common.styles';

interface OwnProps {
  primaryText: string;
  secondaryText: string;
}

const DetailDescription: React.FunctionComponent<OwnProps> = ({
  primaryText,
  secondaryText,
}) => {
  const classes = styles();
  return (
    <Box marginTop={1.875}>
      <Box color={Colors.font_gray} fontSize={12}>{primaryText}</Box>
      <Box color={Colors.almost_black} fontSize={14} className={classes.description} whiteSpace={'wrap'}>
        {secondaryText}
      </Box>
    </Box>
  );
};

export default DetailDescription;
