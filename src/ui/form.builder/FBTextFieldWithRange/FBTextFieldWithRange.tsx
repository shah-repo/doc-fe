import { Box } from "@material-ui/core";
import React from "react";
import { FBTextField } from "..";
import FBText from "../FBText/FBText";
import { FBTextFieldWithRangeProps } from "./FBTextFieldWithRange.types";
import { withFBTextFieldWithRange } from "./FBTextFieldWithRange.wrap";

const FBTextFieldWithRange: React.FunctionComponent<FBTextFieldWithRangeProps> = ({
  range,
  pass,
  aql,
  fai,
  ...props
}) => (
  <Box mb={5}>
    <FBTextField
      { ...props }
      gutter={false}
      rules=""
      // TODO validation
    />
    <Box mt={1} style={{ color: "gray" }} display="flex">
      {range && <FBText
        locale="form.builder.allowed.range"
        values={{
          from: range.from,
          to: range.to,
          suffix: pass || aql || fai ? <>,&nbsp;</> : "",
        }}
      />}
      {pass && <FBText
        locale="form.builder.expected.value"
        values={{
          from: pass.from,
          to: pass.to,
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
