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
  renderTags,
  onChange,
  loading,
  defaultValue,
  ...props
}) =>  {
return (
  <FBInput {...props} type="autocomplete">
    <Autocomplete
      {...{options, multiple, getOptionLabel, onChange, loading, renderInput, renderTags, defaultValue}}
    />
  </FBInput>
);
};

export default withFBAutocomplete(FBAutocomplete);
