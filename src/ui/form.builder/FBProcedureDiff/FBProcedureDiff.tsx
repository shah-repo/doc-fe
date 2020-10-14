import { Switch } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBInput, FBProcedureDiffProps } from "..";
import { withFBProcedureDiff } from "./FBProcedureDiff.wrap";

const FBProcedureDiff: React.FunctionComponent<FBProcedureDiffProps> = ({
  handleChange,
  checked,
  withState,
  name,
  ...props
}) => (
  <FBInput {...props } {...{ name }} type="procedurediff">
   <Switch
      {...{ checked, name }}
      onChange={() => handleChange?.()}
      color="primary"
    />
  </FBInput>
);

export default withFBProcedureDiff(FBProcedureDiff);
