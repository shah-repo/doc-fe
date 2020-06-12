import React from "react";
import { FBProvider } from "..";
import { FBApproversProps } from "./FBApprovers.types";
import { withFBApprovers } from "./FBApprovers.wrap";
import FBApproversField from "./FBApproversField";

const FBApprovers: React.FunctionComponent<FBApproversProps> = ({
  dialogState,
  name,
  docRevState,
  disabled,
}) =>   (
  <FBProvider {...{ dialogState, docRevState }}>
    <FBApproversField name={name} disabled={disabled} {...{ dialogState, docRevState }} />
  </FBProvider>
);

export default withFBApprovers(FBApprovers);
