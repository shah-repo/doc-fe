import { FormHelperText } from "@material-ui/core";
import Box from "@material-ui/core/Box/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { observer } from "mobx-react";
import React from "react";
import { withAutocomplete } from "../../hocs/inputs/withAutocomplete";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
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
  name = "",
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
    <FormHelperText>
      <Box color={error ? "" : "primary.main"}>
        {FBDynamicValidatorStore.getHelperText(name)}
      </Box>
    </FormHelperText>
  </Box>
);

export default observer(withAutocomplete(FBAutocomplete));
