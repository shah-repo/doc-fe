import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import useStyles from "./NoPendingActions.styles";

const NoPendingActions: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Text
        translation="dashboard.noPendingActions"
        dataCy="dashboard.noPendingActions"
      />
    </Box>
  );
};

export default NoPendingActions;
