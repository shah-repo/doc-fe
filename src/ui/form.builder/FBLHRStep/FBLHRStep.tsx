import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBLHRStepProps } from "..";
import { withFBLHRStep } from "./FBLHRStep.wrap";

const FBLHRStep: React.FunctionComponent<FBLHRStepProps> = ({
  name,
  disabled,
  ...props
}) => (
  <FBAutocompleteAsync
    type="lhrstep"
    optionId={FBAutocompleteAsyncOption.mpiDocuments}
    autosave
    {...{ disabled, name }}
  />
);

export default withFBLHRStep(FBLHRStep);
