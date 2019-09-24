import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";
import {
  FBFormDefaultProps,
  FBLabelRendererProps,
  Subtract,
} from "../utils/types";

export function withLabelRenderer<T extends FBFormDefaultProps>(
  Component: React.ComponentType<T>,
) {

  return class extends React.Component<Subtract<T, FBLabelRendererProps>> {

    private labelRenderer = (
      <Box mb={0.5} fontSize="subtitle1.fontSize" fontWeight="fontWeightRegular">
        <Text message={this.props.label as string} />
      </Box>
    );

    public render() {
      return (
        <Component
          labelRenderer={this.props.label && this.labelRenderer}
          {...this.props as T}
        />
      );
    }
  };
}
