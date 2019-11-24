import Box from "@material-ui/core/Box";
import React from "react";
import { withLabel } from "../../hocs/common/withLabel";
import { FBFormDefaultProps } from "../../types/common";

const FBLabel: React.FunctionComponent<
  Pick<FBFormDefaultProps, "label" | "children">
> = ({ label, ...props }) => {
  return (
    <Box mb={4}>
      {label}
      {props.children}
    </Box>
  );
};

export default withLabel(FBLabel);
