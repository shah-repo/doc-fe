import { Box, Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../../common/intl';
import useStyles from './styles';

interface BulkImportProgressProps {
  title: string
  subTitle?: string
  extraTitle?: string
  className?: string
}

const StepTitle: React.FC<BulkImportProgressProps> = ({
  title,
  subTitle,
  extraTitle,
  className = '',
}) => {
  const classes = useStyles();

  return (
    <Box className={cx(classes.container, className)}>
      <Typography
        variant="h1"
        className={classes.title}
      >
        {translate(title)}
      </Typography>
      {subTitle && <Typography
        variant="subtitle1"
        className={classes.subtitle}
      >
        {translate(subTitle)}
      </Typography>}
      {extraTitle && <Typography
        variant="subtitle1"
        className={classes.subtitle}
      >
        {translate(extraTitle)}
      </Typography>}
    </Box>
  );
};

export default StepTitle;
