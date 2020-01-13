import { RenderInputParams } from "@material-ui/lab/Autocomplete/Autocomplete";
import { observer } from "mobx-react";
import React from "react";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import { FBInputProps } from "../../types/common";
import FBTextField from "./FBTextField";

const FBAutocompleteInput: React.FunctionComponent<RenderInputParams &
  Pick<FBInputProps, "name">> = ({ name = "", ...props }) => (
  <FBTextField
    {...props}
    name={name}
    helperText={FBDynamicValidatorStore.helperText[name]}
  />
);

export default observer(FBAutocompleteInput);
