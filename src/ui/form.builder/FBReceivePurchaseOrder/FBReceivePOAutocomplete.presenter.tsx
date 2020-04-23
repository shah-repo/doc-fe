import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from "../FBAutocompleteAsync";


const FBReceivePOAutocompletePresenter: React.FunctionComponent<any> = ({
  handleChange,
  ...props
}) => (
  <Box mb={3}>
    <FBAutocompleteAsync {...props} onChange={handleChange} optionId={FBAutocompleteAsyncOption.po} />
  </Box>
);

export default FBReceivePOAutocompletePresenter;
