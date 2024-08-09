import { Badge } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { withThemeNext } from '../../../../layout/theme-next';
import { BlueTagWithWhiteTextProps } from '../../types';
import useStyles from './styles';

const BlueTagWithWhiteText: React.FC<BlueTagWithWhiteTextProps> = ({
  whiteMainText = translate('administration.blueTagWithWhiteText.whiteText'),
}) => {
  const classes = useStyles();

  return (
    <Badge className={classes.container}>
      {whiteMainText}
    </Badge>
  );
};

export default withThemeNext(BlueTagWithWhiteText);
