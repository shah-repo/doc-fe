import { Box } from "@material-ui/core";
import React from "react";
import { FBText, FBTextField, FBTextFieldWithRangeProps } from "..";
import { withFBTextFieldWithRange } from "./FBTextFieldWithRange.wrap";

const FBTextFieldWithRange: React.FunctionComponent<FBTextFieldWithRangeProps> = ({
  range,
  pass,
  aql,
  fai,
  rules,
  ...props
}) => (
  <Box mb={5}>
    <FBTextField
      { ...props }
      gutter={false}
      type="number"
      { ...{ rules }}
    />
    <Box mt={1} style={{ color: "gray" }} display="flex">
      {range && <FBText
        locale="form.builder.allowed.range"
        values={{
          from: range.from || "N/A",
          to: range.to || "N/A",
          suffix: pass || aql || fai ? <>,&nbsp;</> : "",
        }}
      />}
      {pass && <FBText
        locale="form.builder.expected.value"
        values={{
          from: pass.from || "N/A",
          to: pass.to || "N/A",
          suffix: aql || fai ? <>,&nbsp;</> : "",
        }}
      />}
      {aql && <FBText
        locale="form.builder.aql.value"
        values={{
          value: aql,
          suffix: fai ? <>,&nbsp;</> : "",
        }}
      />}
      {fai && (
        <FBText locale="form.builder.fai" />
      )}
    </Box>
  </Box>
);

export default withFBTextFieldWithRange(FBTextFieldWithRange);
