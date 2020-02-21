import { Provider } from "mobx-react";
import React from "react";
import { FBHelloSignProps } from ".";
import FBInput from "../components/common/FBInput";
import FBButton from "../components/inputs/FBButton";
import FBStore from "../stores/ui/FBStore";
import { withFBHelloSign } from "./FBHelloSign.wrap";

const FBHelloSign: React.FunctionComponent<FBHelloSignProps> = ({
  onClick,
  state,
  ...props
}) => (
  <Provider dialog={state}>
    <FBInput {...props} disabled={false} fullWidth={false}>
      <FBButton
        label={FBStore.mode === "form" ?
          "form.builder.send.signature" : "form.builder.create.template"
        }
        {...{onClick}}
      />
    </FBInput>
  </Provider>
);

export default withFBHelloSign(FBHelloSign);
