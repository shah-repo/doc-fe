import React from "react";
import { FBTestRequirementProps } from ".";
import { FBAutocomplete, FBData } from "..";

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
