import React from "react";
import { FBSchemaSelectProps } from "..";
import { FBAutocomplete } from "../FBAutocomplete";
import { withFBSchemaSelect } from "./FBSchemaSelect.wrap";

const FBSchemaSelect: React.FunctionComponent<FBSchemaSelectProps> = ({
  ...props
}) => (
  <FBAutocomplete {...props} optionValueKey="name" />
);

export default withFBSchemaSelect(FBSchemaSelect);
