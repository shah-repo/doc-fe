import Box from "@material-ui/core/Box/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
}) => (
  <Box mb={4}>
    {label && <FBLabel {...{ error, label, labelValues }} />}
    <Autocomplete
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
  </Box>
);

export default withAutocomplete(FBAutocomplete);
