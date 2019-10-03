import { MenuItem } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { Subtract } from "../types/common";
import { FBSelectInjectedProps, FBSelectProps } from "../types/select";
import { withLabelRenderer } from "./withLabelRenderer";
import { withOnChange } from "./withOnChange";

export function withSelectDefaults<T extends FBSelectProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBSelectInjectedProps>> {

    private EmptyItem = this.props.includeEmpty && (
      <MenuItem value="">
        <Text translation="fields.select.none" tagName="em" />
      </MenuItem>
    );

    private Items = this.props.options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        <Text message={option.text} />
      </MenuItem>
    ));

    public render() {
      return (
        <Component
          fullWidth={true}
          {...this.props as T}
          variant="outlined"
          emptyItem={this.EmptyItem}
          items={this.Items}
        />
      );
    }
  }

  return withOnChange(withLabelRenderer(HOC));
}
