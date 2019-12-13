import { Box, CircularProgress, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { styles } from "./styles";

export const SlackLandingProgress: React.FunctionComponent = ({
}) => {
  const classes = styles();

  return (
    <Box className={classes.alignCenter}>
      <Box marginBottom="30px">
        <Typography variant="h6">
          <Text translation="slack.finalising.registration" />
        </Typography>
      </Box>
      <CircularProgress thickness={1.5} size={60} />
    </Box>
  );
};

export default SlackLandingProgress;
