import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import {
  FBFormDefaultProps,
  FBLabelRendererProps,
  Subtract,
} from "../types/common";

export function withLabelRenderer<T extends FBFormDefaultProps>(
  Component: React.ComponentType<T>,
) {

  return class extends React.Component<Subtract<T, FBLabelRendererProps>> {

    public render() {
      return (
        <Component
          labelRenderer={this.props.label && this.labelRenderer()}
          {...this.props as T}
        />
      );
    }

    private labelRenderer = () => (
      <Box mb={0.5} fontSize="h6.fontSize" fontWeight={300}>
        <Text message={this.props.label as string} />
      </Box>
    )
  };
}
