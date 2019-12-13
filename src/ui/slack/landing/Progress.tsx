import { Typography } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";

export const SlackLandingProgress: React.FunctionComponent = ({
}) => {
  return (
    <Typography variant="h6">
      <Text translation="slack.finalising.registration" />
    </Typography>
  );
};

export default SlackLandingProgress;
