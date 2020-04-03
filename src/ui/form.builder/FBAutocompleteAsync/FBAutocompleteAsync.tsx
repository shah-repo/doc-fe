import React from "react";
import { FBAutocompleteAsyncProps } from ".";
import { FBAutocomplete } from "..";
import { withFBAutocompleteAsync } from "./FBAutocompleteAsync.wrap";

const FBAutocompleteAsync: React.FunctionComponent<FBAutocompleteAsyncProps> = ({
  options,
  ...props
}) =>  (
  <>
    {!options && <FBAutocomplete {...props} disabled={true} />}
    {options && <FBAutocomplete {...props} {...{ options }}/>}
  </>
);

export default withFBAutocompleteAsync(FBAutocompleteAsync);
