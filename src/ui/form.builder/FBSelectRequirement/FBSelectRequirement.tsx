import React from "react";
import { FB, FBAutocomplete, FBAutocompleteAsync, FBData, FBInputProps } from "..";

const FBSelectRequirement: React.FunctionComponent<FBInputProps> = ({
  options,
  ...props
}) => {
  const { isOutput } = FB.useStores().workspaceState || {};
  return (
    <>
      {isOutput && (
        <FBAutocompleteAsync
          {...props}
          selectedOptions={options as string[]}
          multiple={true}
          options={FBData.requirementOptions}
        />
      )}
      {!isOutput && (
        <FBAutocomplete
          {...props}
          multiple={true}
          options={FBData.requirementOptions}
          defaultValue={options}
        />
      )}
    </>
  ); };

export default FBSelectRequirement;
