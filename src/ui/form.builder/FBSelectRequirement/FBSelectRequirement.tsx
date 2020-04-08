import React from "react";
import requirementsOptions from "../../../data/requirementsOptions.json";
import { FBAutocompleteAsync } from "../FBAutocompleteAsync";
import { FBInputProps } from "../types/common";

const FBSelectRequirement: React.FunctionComponent<FBInputProps> = ({
  options,
  ...props
}) => (
  <FBAutocompleteAsync {...props} options={requirementsOptions} selectedOptions={options as string[]} />
);

export default FBSelectRequirement;
