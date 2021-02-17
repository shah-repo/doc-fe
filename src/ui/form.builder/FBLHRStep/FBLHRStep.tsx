import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBInput, FBLHRStepProps } from "..";
import { withFBLHRStep } from "./FBLHRStep.wrap";

const FBLHRStep: React.FunctionComponent<FBLHRStepProps> = ({
  name,
  disabled,
  ...props
}) => (
  <FBInput
    {...props}
    {...{ name }}
    type="lhrstep"
  >
    <FBAutocompleteAsync
      optionId={FBAutocompleteAsyncOption.mpiDocuments}
      gutter={false}
      name={`fb-lhrstep-${name}`}
      {...{ disabled }}
    />
  </FBInput>
);

export default withFBLHRStep(FBLHRStep);
