import React from "react";
import { FBAutocompleteAsync } from "../FBAutocompleteAsync";
import FBDRStore from "../stores/ui/FBDRStore";
import { FBInputProps } from "../types/common";

const FBSelectDocument: React.FunctionComponent<FBInputProps> = ({
  options,
  ...props
}) => (
  <>
    {FBDRStore.isOutput && (
      <FBAutocompleteAsync
        {...props}
        selectedOptions={options as string[]}
        multiple={true}
        optionId="1"
      />
    )}
    {!FBDRStore.isOutput && (
      <FBAutocompleteAsync
        {...props}
        multiple={true}
        optionId="1"
        defaultValue={options}
      />
    )}
  </>
);

export default FBSelectDocument;
