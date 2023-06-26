import { Box } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { ReactComponent as LinkOutArrowIcon } from '../../../../../../assets/images/link-out-arrow.svg';
import { ReactComponent as LinkOutIcon } from '../../../../../../assets/images/link-out.svg';
import useStyles from './HelpCenterOutLink.styles';

const Icon: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.icon}>
      <LinkOutArrowIcon className={classes.arrow} />
      <LinkOutIcon className={classes.outer} />
    </Box>
  );
};

interface Props {
  className?: string
  children?: React.ReactNode
}

const HelpCenterOutLink: React.FC<Props> = ({ className, children }) => {
  const classes = useStyles();

  return (
    <Box className={cx(classes.root, className)} component="span">
      {children}
      <Icon />
    </Box>
  );
};

export default HelpCenterOutLink;
