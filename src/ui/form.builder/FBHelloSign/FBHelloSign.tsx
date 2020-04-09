import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBHelloSignProps } from ".";
import FBInput from "../components/common/FBInput";
import FBButton from "../components/inputs/FBButton";
import { withFBHelloSign } from "./FBHelloSign.wrap";
import FBHelloSignSocket from "./FBHelloSignSocket";

const FBHelloSign: React.FunctionComponent<FBHelloSignProps> = ({
  onClick,
  buttonLabel,
  backdropStyle,
  loadingMessage,
  signatureSent,
  signatureSentMessage,
  waitOverlay,
  ...props
}) => (
  <>
    <FBHelloSignSocket />
    {waitOverlay && (
      <Backdrop className={backdropStyle.backdrop} open={true}>
        <Box display="flex" flexDirection="row" pr={1}>
          <CircularProgress size={20} />
          <Box marginLeft={1} >{loadingMessage}</Box>
        </Box>
      </Backdrop>
    )}
    <FBInput {...props} disabled={false} type="button" fullWidth={false}>
      <FBButton label={buttonLabel} {...{ onClick }} />
      {signatureSent && (
        <Box>{signatureSentMessage}</Box>
      )}
    </FBInput>
  </>
);

export default withFBHelloSign(FBHelloSign);
