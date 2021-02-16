import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBInput, FBLHRStepProps } from "..";
import { withFBLHRStep } from "./FBLHRStep.wrap";

const FBLHRStep: React.FunctionComponent<FBLHRStepProps> = ({
  name,
  ...props
}) => (
  <FBInput {...props} {...{ name }} type="lhrstep">
    <FBAutocompleteAsync
      name={`fb-lhrstep-mpi-${name}`}
      optionId={FBAutocompleteAsyncOption.mpiDocuments}
      gutter={false}
    />
  </FBInput>
);

export default withFBLHRStep(FBLHRStep);
