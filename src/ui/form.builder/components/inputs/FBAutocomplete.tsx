import Autocomplete from "@material-ui/lab/Autocomplete";
import { observer } from "mobx-react";
import React from "react";
import { withAutocomplete } from "../../hocs/inputs/withAutocomplete";
import { FBAutocompleteProps } from "../../types/inputs/autocomplete";
import FBLabel from "../common/FBLabel";

const FBAutocomplete: React.FunctionComponent<FBAutocompleteProps> = ({
  label,
  optionLabel,
  options,
  value,
  ...props
}) => {
  return (
    <FBLabel label={label}>
    <Autocomplete
      value={value}
      options={options as any[]}
      filterSelectedOptions={true}
      {...props}
    />
    </FBLabel>
  );
};

export default observer(withAutocomplete(FBAutocomplete));
