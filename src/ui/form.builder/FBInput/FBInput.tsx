import { FormControl, FormHelperText } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import _ from "lodash";
import React from "react";
import { FBFieldName, FBInputProps, FBLabel, FBTextField } from "..";
import { withFBInput } from "./FBInput.wrap";

const FBInput: React.FunctionComponent<FBInputProps> = ({
  label,
  error,
  labelValues,
  gutter = true,
  children,
  helperText = "",
  disabled,
  includeContext,
  loading,
  type,
  hidden,
  name,
}) => (
  <>
    {!hidden && (
      <Box mb={gutter ? 5 : 0}>
        <FormControl fullWidth {...{ error }}>
          {label && <FBLabel {...{ error, label, labelValues, loading }} />}
          {children}
        </FormControl>
        {!_.isEmpty(helperText) && (
          <FormHelperText {...{ error }}>{helperText}</FormHelperText>
        )}
        {includeContext && (
          <Box mt={type === "select" ? 3 : 0.5}>
            <FBTextField
              label="common.note"
              {...{ disabled }}
              name={`${FBFieldName.Context}-${name}`}
            />
          </Box>
        )}
      </Box>
    )}
  </>
);

export default withFBInput(FBInput);
