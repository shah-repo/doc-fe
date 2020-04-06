import React from "react";
import FBAutocompleteAsync from "../FBAutocompleteAsync";
import { FBInputProps } from "../types/common";

const FBSelectDocument: React.FunctionComponent<FBInputProps> = ({
  options,
  ...props
}) => (
  <FBAutocompleteAsync {...props} selectedOptions={options as string[]} />
);

export default FBSelectDocument;
