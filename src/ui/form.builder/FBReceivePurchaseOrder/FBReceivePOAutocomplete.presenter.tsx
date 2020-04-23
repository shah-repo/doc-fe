import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from "../FBAutocompleteAsync";


const FBReceivePOAutocompletePresenter: React.FunctionComponent<any> = ({
  handleChange,
  poId,
  ...props
}) => (
  <Box mb={3}>
    <FBAutocompleteAsync
      {...props}
      onChange={handleChange}
      optionId={FBAutocompleteAsyncOption.po}
      value={poId}
    />
  </Box>
);

export default FBReceivePOAutocompletePresenter;
