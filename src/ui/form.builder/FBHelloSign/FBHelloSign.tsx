import { Backdrop, Box, CircularProgress } from '@material-ui/core';
import React from 'react';
import { FBButton, FBHelloSignProps, FBInput } from '..';
import { withFBHelloSign } from './FBHelloSign.wrap';

const FBHelloSign: React.FunctionComponent<FBHelloSignProps> = ({
  onClick,
  loadingMessage,
  waitOverlay,
  buttonLabel,
  signatureSent,
  signatureSentMessage,
  ...props
}) => (
  <>
    {waitOverlay && (
      <Backdrop style={{ zIndex: 1550, color: '#fff' }} open={true}>
        <Box display="flex" flexDirection="row" pr={1}>
          <CircularProgress size={20} />
          <Box marginLeft={1} >{loadingMessage}</Box>
        </Box>
      </Backdrop>
    )}

    <FBInput {...props}>
      <>
        <FBButton
          label={buttonLabel}
          style={{ marginLeft: 0 }}
          {...{ onClick }}
        />
        {signatureSent && (
          <Box>{signatureSentMessage}</Box>
        )}
      </>
    </FBInput>

  </>
);

export default withFBHelloSign(FBHelloSign);
