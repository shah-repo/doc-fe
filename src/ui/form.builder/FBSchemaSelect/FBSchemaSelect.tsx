import React from "react";
import { FBAutocomplete, FBSchemaSelectProps } from "..";
import { withFBSchemaSelect } from "./FBSchemaSelect.wrap";

const FBSchemaSelect: React.FunctionComponent<FBSchemaSelectProps> = ({
  ...props
}) => (
  <FBAutocomplete {...props} optionValueKey="name" />
);

export default withFBSchemaSelect(FBSchemaSelect);
