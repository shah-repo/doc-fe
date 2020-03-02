import { Provider } from "mobx-react";
import React from "react";
import { FBHelloSignProps } from ".";
import FBInput from "../components/common/FBInput";
import FBButton from "../components/inputs/FBButton";
import FBTextField from "../components/inputs/FBTextField";
import { withFBHelloSign } from "./FBHelloSignPremade.wrap";

const FBHelloSignPremade: React.FunctionComponent<FBHelloSignProps> = ({
  onClick,
  state,
  buttonLabel,
  templateId,
  disabled,
  ...props
}) => (
  <Provider dialog={state}>
    <FBInput {...props} disabled={false} fullWidth={false}>
      <FBButton label={buttonLabel} {...{ onClick }} />
    </FBInput>
    <FBTextField
      name="templateId"
      label="TemplateID"
      defaultValue={templateId}
      {...{ disabled }}
    />
  </Provider>
);

export default withFBHelloSign(FBHelloSignPremade);
