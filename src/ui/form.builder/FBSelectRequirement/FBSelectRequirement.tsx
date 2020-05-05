import React from "react";
import { FBAutocomplete, FBAutocompleteAsync, FBData, FBInputProps } from "..";
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
        options={FBData.requirementOptions}
      />
    )}
    {!FBDRStore.isOutput && (
      <FBAutocomplete
        {...props}
        multiple={true}
        options={FBData.requirementOptions}
        defaultValue={options}
      />
    )}
  </>
);

export default FBSelectRequirement;
