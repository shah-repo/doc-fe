import React from "react";
import { FBAutocomplete, FBAutocompleteAsyncProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBAutocompleteAsync } from "./FBAutocompleteAsync.wrap";

const FBAutocompleteAsync: React.FunctionComponent<FBAutocompleteAsyncProps> = ({
  options,
  defaultValue,
  forceNewRender,
  ...props
}) => (
  <>
    {!options && !forceNewRender && <FBAutocomplete {...props} disabled={true}
      inputPropStyle={{
        height: 40,
        background: Colors.white, border: `1px solid ${Colors.gray_goose}`, borderRadius: 3, padding: "0 0 0 6px",
      }}
      labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
      inputPropStyleSize="small"/>}
    {!options && forceNewRender && <FBAutocomplete {...props} disabled={true} inputPropStyle={{
      height: 40,
      background: Colors.white, border: `1px solid ${Colors.gray_goose}`, borderRadius: 3, padding: "0 0 0 6px",
    }}
    labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
    inputPropStyleSize="small"/>}
    {options && !forceNewRender && <FBAutocomplete {...props} {...{ options, defaultValue }}inputPropStyle={{
      height: 40,
      background: Colors.white, border: `1px solid ${Colors.gray_goose}`, borderRadius: 3, padding: "0 0 0 6px",
    }}
    labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
    inputPropStyleSize="small" />}
    {options && forceNewRender && <FBAutocomplete {...props} {...{ options, defaultValue }}inputPropStyle={{ height: 40, background: Colors.white, border: `1px solid ${Colors.gray_goose}`, borderRadius: 3, padding: "0 0 0 6px" }}
      labelProps={{ mb: 1.25, fontFamily: "Sora", fontWeight: 600, fontSize: 12 }}
      inputPropStyleSize="small" />}
  </>
);

export default withFBAutocompleteAsync(FBAutocompleteAsync);
