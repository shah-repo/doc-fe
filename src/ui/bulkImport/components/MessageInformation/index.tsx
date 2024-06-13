import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
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
      {showError ? <FontAwesomeIcon
        className={classes.messageIconError}
        icon={solid('triangle-exclamation')}
      /> : <FontAwesomeIcon
        className={classes.messageIcon}
        icon={solid('circle-check')}
      />}
      <Typography className={classes.message}>{message}</Typography>
      {showLinkMessage && <Typography className={classes.viewErrors}><Text translation="common.viewErrors" /></Typography>}
    </Box>
  );
};

export default MessageInformation;
