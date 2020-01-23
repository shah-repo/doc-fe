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
  hidden,
}) => (
  <Box mb={4}>
    {!hidden && (
      <Box>
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
    )}
  </Box>
);

export default withAutocomplete(FBAutocomplete);
