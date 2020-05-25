import React from "react";
import { FBAutocompleteAsyncProps } from ".";
import { FBAutocomplete } from "..";
import { withFBAutocompleteAsync } from "./FBAutocompleteAsync.wrap";

const FBAutocompleteAsync: React.FunctionComponent<FBAutocompleteAsyncProps> = ({
  options,
  ...props
}) =>  (
  <>
    {!options && <FBAutocomplete {...props} disabled={true} type="autocompleteasync" />}
    {options && <FBAutocomplete {...props} {...{ options }} type="autocompleteasync" />}
  </>
);

export default withFBAutocompleteAsync(FBAutocompleteAsync);
