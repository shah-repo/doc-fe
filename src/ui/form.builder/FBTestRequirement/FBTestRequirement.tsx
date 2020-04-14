import React from "react";
import { FBTestRequirementProps } from ".";
import { FBAutocomplete } from "..";
import requirementsOptions from "../../../data/requirementsOptions.json";


const FBTestRequirement: React.FunctionComponent<FBTestRequirementProps> = ({
  testRequirement,
  ...props
}) => (
  <FBAutocomplete
    {...props}
    defaultValue={testRequirement}
    disabled={true}
    options={requirementsOptions}
  />
);

export default FBTestRequirement;
