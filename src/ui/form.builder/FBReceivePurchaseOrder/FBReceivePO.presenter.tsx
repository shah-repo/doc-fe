import { Box } from "@material-ui/core";
import React from "react";
import FBReceivePOAutocompleteContainer from "./autocomplete/FBReceivePOAutocomplete.container";
import FBReceivePOTableContainer from "./table/FBReceivePOTable.container";


const FBReceivePOPresenter: React.FunctionComponent<any> = ({
  receiveState,
  ...props
}) => (
  <Box mb={3}>
    <FBReceivePOAutocompleteContainer {...props} />
    <FBReceivePOTableContainer {...props} />
  </Box>
);

export default FBReceivePOPresenter;
