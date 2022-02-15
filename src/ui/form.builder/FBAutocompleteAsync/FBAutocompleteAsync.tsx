import React from "react";
import { FBAutocomplete, FBAutocompleteAsyncProps } from "..";
import { withFBAutocompleteAsync } from "./FBAutocompleteAsync.wrap";

const FBAutocompleteAsync: React.FunctionComponent<FBAutocompleteAsyncProps> = ({
  options,
  defaultValue,
  forceNewRender,
  onFocus,
  ...props
}) =>  (
  <>
    {!options && !forceNewRender && <FBAutocomplete {...props} disabled={true} onFocus={onFocus}/>}
    {!options && forceNewRender && <FBAutocomplete {...props} disabled={true} onFocus={onFocus}/>}
    {options && !forceNewRender && <FBAutocomplete {...props} {...{ options, defaultValue }} onFocus= { onFocus }/>}
    {options && forceNewRender && <FBAutocomplete {...props} {...{ options, defaultValue }} onFocus={ onFocus } />}
  </>
);

export default withFBAutocompleteAsync(FBAutocompleteAsync);
