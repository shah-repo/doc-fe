import Box from "@material-ui/core/Box/Box";
import React from "react";
import Text from "../../../components/Text";
import { FBFormDefaultProps } from "../../types/common";

export const withLabel = <T extends Pick<FBFormDefaultProps, "label">>(
  Component: React.FunctionComponent<T>,
) => {
  return (props: T) => {
    let labelRenderer = props.label;

    if (props.label && typeof props.label === "string") {
      labelRenderer = (
        <Box mb={0.5} fontSize="h6.fontSize" fontWeight={300}>
          <Text message={props.label as string} />
        </Box>
      );
    }
    return Component({
      ...props,
      label: labelRenderer,
    });
  };
};
