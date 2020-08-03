import Box from "@material-ui/core/Box/Box";
import React from "react";
import { withAction } from "../../hocs/actions/withAction";
import { FBActionProps } from "../../types/actions/action";

const FBAction: React.FunctionComponent<FBActionProps> = ({
  indicators,
  actionButton,
}) => (
  <Box borderBottom={1} pb={2} mb={4}>
    {indicators}
    {actionButton}
  </Box>
);

export default withAction(FBAction);
