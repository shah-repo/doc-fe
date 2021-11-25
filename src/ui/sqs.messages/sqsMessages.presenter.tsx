import { Box, List } from "@material-ui/core";
import React from "react";
import { styles } from "./sqsMessages.styles";


const RecentsPresenter: React.FunctionComponent = () => {
  const classes = styles();
  const render = () => (
    <List className={classes.root}>
      <h1>Welcome to SQS Messages</h1>
    </List>
  );

  return (
    <Box>
      {/* <AsyncGate
        asyncAction={loadRecents}
        asyncState={loadRecentsListAsyncState}
        startActionOnMount={true}
      > */}
      {render()}
      {/* </AsyncGate> */}
    </Box>
  );
};
export default RecentsPresenter;
