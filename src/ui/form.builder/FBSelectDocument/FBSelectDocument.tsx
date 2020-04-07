import React from "react";
import FBAutocompleteAsync from "../FBAutocompleteAsync";
import { FBInputProps } from "../types/common";

const FBSelectDocument: React.FunctionComponent<FBInputProps> = ({
  options,
  ...props
}) => (
  <FBAutocompleteAsync {...props} optionId="1" selectedOptions={options as string[]} />
);

export default FBSelectDocument;
