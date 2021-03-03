import { Box, CircularProgress, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { styles } from "./styles";

const SlackLandingProgress: React.FunctionComponent = () => {
  const classes = styles();

  return (
    <Box className={classes.alignCenter}>
      <Box>
        <Typography variant="h6">
          <Text translation="slack.finalising.registration" />
        </Typography>
      </Box>
      <Box margin="30px 0">
        <CircularProgress thickness={1.5} size={60} />
      </Box>
    </Box>
  );
};

export default SlackLandingProgress;
