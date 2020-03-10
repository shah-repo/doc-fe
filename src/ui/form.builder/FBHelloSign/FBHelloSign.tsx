import { Backdrop, Box, CircularProgress } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import { FBHelloSignProps } from ".";
import FBInput from "../components/common/FBInput";
import FBButton from "../components/inputs/FBButton";
import { withFBHelloSign } from "./FBHelloSign.wrap";

const FBHelloSign: React.FunctionComponent<FBHelloSignProps> = ({
  onClick,
  state,
  buttonLabel,
  backdropStyle,
  loadingMessage,
  waitOverlay,
  ...props
}) => (
    <Provider dialog={state}>
      {waitOverlay && (
        <Backdrop className={backdropStyle.backdrop} open={true}>
          <Box display="flex" flexDirection="row" pr={1}>
            <CircularProgress size={20} />
            <Box marginLeft={1} >{loadingMessage}</Box>
          </Box>
        </Backdrop>
      )}
      <FBInput {...props} disabled={false} fullWidth={false}>
        <FBButton label={buttonLabel} {...{ onClick }} />
      </FBInput>
    </Provider>
  );

export default withFBHelloSign(FBHelloSign);
