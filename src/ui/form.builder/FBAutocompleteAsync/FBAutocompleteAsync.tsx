import React from "react";
import { FBAutocomplete, FBAutocompleteAsyncProps } from "..";
import { withFBAutocompleteAsync } from "./FBAutocompleteAsync.wrap";

const FBAutocompleteAsync: React.FunctionComponent<FBAutocompleteAsyncProps> = ({
  options,
  defaultValue,
  forceNewRender,
  disableClearable,
  ...props
}) => (
  <>
    {!options && !forceNewRender && <FBAutocomplete {...props} disabled={true} disableClearable={disableClearable} />}
    {!options && forceNewRender && <FBAutocomplete {...props} disabled={true} disableClearable={disableClearable} />}
    {options && !forceNewRender && <FBAutocomplete {...props} {...{ options, defaultValue }} disableClearable={disableClearable} />}
    {options && forceNewRender && <FBAutocomplete {...props} {...{ options, defaultValue }} disableClearable={disableClearable} />}
  </>
);

export default withFBAutocompleteAsync(FBAutocompleteAsync);
