import { Box, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
import Text from '../../../components/Text';
import useStyles from './styles';

interface MessageInformationProps {
  message: string
  showError?: boolean
  showLink?: boolean
}

const MessageInformation: React.FC<MessageInformationProps> = ({ message, showError, showLink }) => {
  const classes = useStyles();
  const showLinkMessage = showError && showLink;

  return (
    <Box className={showError ? classes.messageContainerError : classes.messageContainer}>
      {showError ? <WarningIcon className={classes.messageIconError} /> : <CheckCircleIcon className={classes.messageIcon} />}
      <Typography className={classes.message}>{message}</Typography>
      {showLinkMessage && <Typography className={classes.viewErrors}><Text translation="common.viewErrors" /></Typography>}
    </Box>
  );
};

export default MessageInformation;
