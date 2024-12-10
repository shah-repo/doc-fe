import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import Text from '../../../components/Text';
import useStyles from './styles';

interface MessageInformationProps {
  message: string
  showError?: boolean
  showLink?: boolean
  hideMessage?: boolean
}

const MessageInformation: React.FC<MessageInformationProps> = ({ message, showError, showLink, hideMessage = false }) => {
  const classes = useStyles();
  const showLinkMessage = showError && showLink;

  return (
    <Box
      className={cx(classes.messageContainer, {
        [classes.messageContainerError]: showError && !hideMessage,
        [classes.messageContainerSuccess]: !showError && !hideMessage,
      })}
    >
      {!hideMessage && (
        <>
          {showError ? <FontAwesomeIcon
            className={classes.messageIconError}
            icon={solid('triangle-exclamation')}
          /> : <FontAwesomeIcon
            className={classes.messageIcon}
            icon={solid('circle-check')}
          />}
          <Typography className={classes.message}>{message}</Typography>
          {showLinkMessage && <Typography className={classes.viewErrors}><Text translation="common.viewErrors" /></Typography>}
        </>
      )}
    </Box>
  );
};

export default MessageInformation;
