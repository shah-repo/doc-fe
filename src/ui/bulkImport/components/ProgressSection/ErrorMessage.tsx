import { Box, Typography } from '@material-ui/core';
import { noop } from 'lodash';
import React from 'react';
import useStyles from './styles';

interface MessageBoxProps {
  message: string
  action?: React.ReactNode
  callback?: () => void
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, action, callback = noop }) => {
  const classes = useStyles();

  return (
    <Box className={classes.itemErrorMessage}>
      <Typography className={classes.itemErrorMessageText}>
        {message}{' '}
        {action && <Box component="span" onClick={callback}>{action}</Box>}
      </Typography>
    </Box>
  );
};

export default MessageBox;
