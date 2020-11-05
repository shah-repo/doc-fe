import React from "react";
import { FBAutocompleteAsyncProps } from ".";
import { FBAutocomplete } from "..";
import { withFBAutocompleteAsync } from "./FBAutocompleteAsync.wrap";

const FBAutocompleteAsync: React.FunctionComponent<FBAutocompleteAsyncProps> = ({
  options,
  defaultValue,
  forceNewRender,
  ...props
}) =>  (
  <>
    {!options && !forceNewRender && <FBAutocomplete {...props} disabled={true} />}
    {!options && forceNewRender && <FBAutocomplete {...props} disabled={true} />}
    {options && !forceNewRender && <FBAutocomplete {...props} {...{ options, defaultValue }} />}
    {options && forceNewRender && <FBAutocomplete {...props} {...{ options, defaultValue }} />}
  </>
);

export default withFBAutocompleteAsync(FBAutocompleteAsync);
