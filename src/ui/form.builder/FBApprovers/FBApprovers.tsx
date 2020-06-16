import { Provider } from "mobx-react";
import React from "react";
import { FBApproversProps } from "./FBApprovers.types";
import { withFBApprovers } from "./FBApprovers.wrap";
import FBApproversField from "./FBApproversField";

const FBApprovers: React.FunctionComponent<FBApproversProps> = ({
  name,
  disabled,
}) =>   (
  <Provider>
    <FBApproversField name={name} disabled={disabled} />
  </Provider>
);

export default withFBApprovers(FBApprovers);
