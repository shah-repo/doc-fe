import Box from "@material-ui/core/Box/Box";
import React from "react";
import { withActionContainer } from "../../hocs/actions/withActionContainer";
import { FBActionContainerProps } from "../../types/actions/action";

const FBActionContainer: React.FunctionComponent<FBActionContainerProps> = ({
  actions,
}) => (
  <Box>
    {actions}
  </Box>
);

export default withActionContainer(FBActionContainer);
