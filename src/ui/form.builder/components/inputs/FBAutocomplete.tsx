import Autocomplete from "@material-ui/lab/Autocomplete";
import { observer } from "mobx-react";
import React from "react";
import { withAutocomplete } from "../../hocs/inputs/withAutocomplete";
import { FBAutocompleteProps } from "../../types/inputs/autocomplete";
import Box from "@material-ui/core/Box/Box";
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
}) => (
  <Box mb={4}>
    {label && <FBLabel {...{error, label, labelValues}} />}
    <Autocomplete
      options={options as any[]}
      {...{filterOptions, renderInput, getOptionLabel, multiple, onChange}}
    />
  </Box>
);

export default observer(withAutocomplete(FBAutocomplete));
