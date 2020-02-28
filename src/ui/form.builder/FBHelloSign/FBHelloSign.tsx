import { Provider } from "mobx-react";
import React from "react";
import { FBHelloSignProps } from ".";
import FBInput from "../components/common/FBInput";
import FBButton from "../components/inputs/FBButton";
// import FBStore from "../stores/ui/FBStore";
import { withFBHelloSign } from "./FBHelloSign.wrap";

const FBHelloSign: React.FunctionComponent<FBHelloSignProps> = ({
  onClick,
  state,
  buttonLabel,
  ...props
}) => (
  <Provider dialog={state}>
    <FBInput {...props} disabled={false} fullWidth={false}>
      <FBButton label={buttonLabel} {...{onClick}} />
    </FBInput>
  </Provider>
);

export default withFBHelloSign(FBHelloSign);
