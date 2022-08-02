import React from "react";
import { FBAutocomplete, FBAutocompleteAsyncProps } from "..";
import { styles } from "../styles/FBAutocomplete.styles";
import { withFBAutocompleteAsync } from "./FBAutocompleteAsync.wrap";

const FBAutocompleteAsync: React.FunctionComponent<
  FBAutocompleteAsyncProps
> = ({ options, defaultValue, forceNewRender, ...props }) => (
  <>
    {!options && !forceNewRender && (
      <FBAutocomplete
        {...props}
        disabled={true}
        inputPropStyle={{ ...styles.inputPropStyle, ...props.inputPropStyle }}
        labelProps={styles.labelProps}
        inputPropStyleSize="small"
      />
    )}
    {!options && forceNewRender && (
      <FBAutocomplete
        {...props}
        disabled={true}
        inputPropStyle={{ ...styles.inputPropStyle, ...props.inputPropStyle }}
        labelProps={styles.labelProps}
        inputPropStyleSize="small"
      />
    )}
    {options && !forceNewRender && (
      <FBAutocomplete
        {...props}
        {...{ options, defaultValue }}
        inputPropStyle={{ ...styles.inputPropStyle, ...props.inputPropStyle }}
        labelProps={styles.labelProps}
        inputPropStyleSize="small"
      />
    )}
    {options && forceNewRender && (
      <FBAutocomplete
        {...props}
        {...{ options, defaultValue }}
        inputPropStyle={{ ...styles.inputPropStyle, ...props.inputPropStyle }}
        labelProps={styles.labelProps}
        inputPropStyleSize="small"
      />
    )}
  </>
);

export default withFBAutocompleteAsync(FBAutocompleteAsync);
