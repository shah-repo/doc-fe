import { Box } from "@material-ui/core";
import React from "react";
import FBReceivePOAutocompleteContainer from "./FBReceivePOAutocomplete.container";


const FBReceivePOPresenter: React.FunctionComponent<any> = ({
  receiveState,
  ...props
}) => (
  <Box mb={3}>
    <FBReceivePOAutocompleteContainer {...props} />
  </Box>
);

export default FBReceivePOPresenter;
