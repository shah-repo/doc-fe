import React from "react";
import { FBAutocomplete, FBAutocompleteAsync, FBInputProps } from "..";
import requirementsOptions from "../../../data/requirementsOptions.json";
import FBDRStore from "../stores/ui/FBDRStore";

const FBSelectRequirement: React.FunctionComponent<FBInputProps> = ({
  options,
  ...props
}) => (
  <>
    {FBDRStore.isOutput && (
      <FBAutocompleteAsync
        {...props}
        selectedOptions={options as string[]}
        multiple={true}
        options={requirementsOptions}
      />
    )}
    {!FBDRStore.isOutput && (
      <FBAutocomplete
        {...props}
        multiple={true}
        options={requirementsOptions}
        defaultValue={options}
      />
    )}
  </>
);

export default FBSelectRequirement;
