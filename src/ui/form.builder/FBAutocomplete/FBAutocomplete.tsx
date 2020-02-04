import { CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { FBAutocompleteProps } from ".";
import FBInput from "../components/common/FBInput";
import { withFBAutocomplete } from "./FBAutocomplete.wrap";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  multiple = false,
  options = [],
  getOptionLabel,
  renderInput,
  loading,
  defaultValue,
  renderEl,
  ...props
}) =>  {
return (
  <FBInput {...props} type="autocomplete">
    {loading && <CircularProgress size={20} />}
    {renderEl && (
      <Autocomplete
        {...{options, multiple, getOptionLabel, loading, renderInput, defaultValue}}
      />
    )}
  </FBInput>
);
};

export default withFBAutocomplete(FBAutocomplete);
