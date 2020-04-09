import { Box, Chip, TextField, Typography } from "@material-ui/core";
import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";
import _ from "lodash";
import React from "react";
import { FBAutocompleteProps } from ".";
import { FBMapWrapper } from "..";
import Text from "../../components/Text";
import FBInput from "../components/common/FBInput";
import { withFBAutocomplete } from "./FBAutocomplete.wrap";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  multiple = false,
  options = [],
  getOptionLabel,
  defaultValue,
  includeQRScan,
  optionLabelKey = "",
  placeholder,
  disabled,
  ...props
}) =>  (
  <FBInput {...props} {...{ multiple, disabled }} type="autocomplete">
    {includeQRScan && (
      <Box display="flex" flexDirection="row-reverse">
        <Typography variant="button" display="block" color="primary">
          <Text message="form.builder.scan.qr" />
        </Typography>
      </Box>
    )}
    <Autocomplete
      {...{ options, multiple, getOptionLabel, defaultValue }}
      renderInput={(params: RenderInputParams) => (
        <TextField
          {...params}
          {...{ placeholder }}
          variant="outlined"
          fullWidth
        />
      )}
      renderTags={(value, getTagProps) => (
        <FBMapWrapper<any[]> collection={value}>
          {(option, index) => (
            <Chip
              key={`fb-autocomplete-${_.get(option, optionLabelKey)}-${index}`}
              label={<Box whiteSpace="normal">{_.get(option, optionLabelKey)}</Box>}
              {...getTagProps({ index })}
              {...{ disabled }}
            />
          )}
        </FBMapWrapper>
      )}
    />
  </FBInput>
);

export default withFBAutocomplete(FBAutocomplete);
