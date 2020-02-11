import { Provider } from "mobx-react";
import React from "react";
import { FBHelloSignProps } from ".";
import { FBDialog } from "..";
import FBInput from "../components/common/FBInput";
import FBButton from "../components/inputs/FBButton";
import FBFileUpload from "../components/navigation/FBFileUpload";
import { withFBHelloSign } from "./FBHelloSign.wrap";

const FBHelloSign: React.FunctionComponent<FBHelloSignProps> = ({
  onClick,
  state,
  ...props
}) => (
  <Provider dialog={state}>
    <FBInput {...props} disabled={false} fullWidth={false}>
      <FBButton label="form.builder.create.template" {...{onClick}} />
    </FBInput>
    <FBFileUpload name="files" />
    <FBDialog />
  </Provider>
);

export default withFBHelloSign(FBHelloSign);
