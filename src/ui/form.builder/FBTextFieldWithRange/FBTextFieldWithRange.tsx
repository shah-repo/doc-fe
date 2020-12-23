import { Box } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import React from "react";
import { FBOutOfRange, FBText, FBTextField, FBTextFieldWithRangeProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBTextFieldWithRange } from "./FBTextFieldWithRange.wrap";

const FBTextFieldWithRange: React.FunctionComponent<FBTextFieldWithRangeProps> = ({
  range,
  pass,
  aql,
  criticalToQuality,
  includeInFaiInspection,
  rules,
  name,
  ...props
}) => (
  <Box mb={5}>
    {criticalToQuality && (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        mb={-2.5}
      >
        <WarningIcon color="error" />
        <FBText
          locale="form.builder.critical.to.quality"
          boxProps={{
            mt: 0.2,
            pl: 0.5,
            color: Colors.error_red,
            fontWeight: "bold",
          }}
        />
      </Box>
    )}
    <FBTextField
      { ...props }
      gutter={false}
      type="number"
      { ...{ rules }}
      InputProps={{
        endAdornment: <FBOutOfRange {...{ pass }} parentName={name} />,
      }}
      withState
    />
    <Box mt={1} style={{ color: "gray" }} display="flex">
      {range && <FBText
        locale="form.builder.allowed.range"
        values={{
          from: range.from || "N/A",
          to: range.to || "N/A",
          suffix: pass || aql || includeInFaiInspection ? <>,&nbsp;</> : "",
        }}
      />}
      {pass && <FBText
        locale="form.builder.expected.value"
        values={{
          from: pass.from || "N/A",
          to: pass.to || "N/A",
          suffix: aql || includeInFaiInspection ? <>,&nbsp;</> : "",
        }}
      />}
      {aql && <FBText
        locale="form.builder.aql.value"
        values={{
          value: aql,
          suffix: includeInFaiInspection ? <>,&nbsp;</> : "",
        }}
      />}
      {includeInFaiInspection && (
        <FBText locale="form.builder.fai" />
      )}
    </Box>
  </Box>
);

export default withFBTextFieldWithRange(FBTextFieldWithRange);
