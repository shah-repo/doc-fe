import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBInput, FBProcedureDiffProps, FBText } from "..";
import { withFBProcedureDiff } from "./FBProcedureDiff.wrap";

const FBProcedureDiff: React.FunctionComponent<FBProcedureDiffProps> = ({
  handleChange,
  checked,
  withState,
  name,
  ...props
}) => (
  <FBInput {...props } {...{ name }} type="procedurediff">
    <FormControlLabel
      control={
        <Switch
          {...{ checked, name }}
          onChange={() => handleChange?.()}
          color="primary"
        />
      }
      label={<FBText locale="form.builder.prev.build.changes" />}
    />

  </FBInput>
);

export default withFBProcedureDiff(FBProcedureDiff);
