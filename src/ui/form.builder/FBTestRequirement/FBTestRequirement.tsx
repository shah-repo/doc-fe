import React from "react";
import { FBAutocomplete, FBData, FBTestRequirementProps } from "..";

const FBTestRequirement: React.FunctionComponent<FBTestRequirementProps> = ({
  testRequirement,
  ...props
}) => (
  <FBAutocomplete
    {...props}
    defaultValue={testRequirement}
    disabled={true}
    options={FBData.requirementOptions}
  />
);

export default FBTestRequirement;
