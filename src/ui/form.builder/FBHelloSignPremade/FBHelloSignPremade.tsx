import { Provider } from "mobx-react";
import React from "react";
import { FBHelloSignProps } from ".";
import FBInput from "../components/common/FBInput";
import FBButton from "../components/inputs/FBButton";
import { withFBHelloSign } from "./FBHelloSignPremade.wrap";
import FBTextField from "../components/inputs/FBTextField";

const FBHelloSignPremade: React.FunctionComponent<FBHelloSignProps> = ({
  onClick,
  state,
  buttonLabel,
  templateId,
  ...props
}) => (
  <Provider dialog={state}>
    <FBInput {...props} disabled={false} fullWidth={false}>
      <FBButton label={buttonLabel} {...{onClick}} />
    </FBInput>
    <FBTextField name="templateId" label="TemplateID" value={templateId}/>
  </Provider>
);

export default withFBHelloSign(FBHelloSignPremade);
