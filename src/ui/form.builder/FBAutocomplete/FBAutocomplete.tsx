import { Box, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { FBAutocompleteProps } from ".";
import Text from "../../components/Text";
import FBInput from "../components/common/FBInput";
import { withFBAutocomplete } from "./FBAutocomplete.wrap";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  multiple = false,
  options = [],
  getOptionLabel,
  renderInput,
  defaultValue,
  renderEl,
  renderTags,
  includeQRScan,
  ...props
}) =>  (
  <>
    <FBInput {...props} type="autocomplete">
      {includeQRScan && (
        <Box display="flex" flexDirection="row-reverse">
          <Typography variant="button" display="block" color="primary">
            <Text message="form.builder.scan.qr" />
          </Typography>
        </Box>)}
      {renderEl && (
        <Autocomplete
          {...{ options, multiple, getOptionLabel, defaultValue, renderTags }}
          renderInput={renderInput || (() => <div />)}
          disableCloseOnSelect={multiple}
        />
      )}
    </FBInput>
  </>
);

export default withFBAutocomplete(FBAutocomplete);
