// import { FormHelperText } from "@material-ui/core";
import Box from "@material-ui/core/Box/Box";
import React from "react";
import { withAutocomplete } from "../../hocs/inputs/withAutocomplete";
import { FBAutocompleteProps } from "../../types/inputs/autocomplete";
import FBLabel from "../common/FBLabel";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  options,
  filterOptions,
  renderInput,
  getOptionLabel,
  multiple,
  onChange,
  label,
  error,
  labelValues,
  disabled,
  hidden,
  helperText,
}) => (
  <Box mb={4}>
    {!hidden && (
      <Box>
        {label && <FBLabel {...{ error, label, labelValues }} />}
        {/* <Autocomplete
          options={options as any[]}
          {...{
            filterOptions,
            renderInput,
            getOptionLabel,
            multiple,
            onChange,
            disabled,
          }}
        />
        {!_.isEmpty(helperText) && (
          <FormHelperText>
            <Box color={error ? "" : "primary.main"}>{helperText}</Box>
          </FormHelperText>
        )} */}
      </Box>
    )}
  </Box>
);

export default withAutocomplete(FBAutocomplete);
