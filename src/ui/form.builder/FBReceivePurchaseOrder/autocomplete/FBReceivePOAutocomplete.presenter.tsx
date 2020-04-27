import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from "../../FBAutocompleteAsync";


const FBReceivePOAutocompletePresenter: React.FunctionComponent<any> = ({
  handleChange,
  poId,
  isLoading,
  ...props
}) => {
  const renderSpinner = isLoading &&
    <Box padding="0 50%">
      <CircularProgress />
    </Box>;
  return (
    <Box mb={3}>
      <FBAutocompleteAsync
        {...props}
        onChange={handleChange}
        optionId={FBAutocompleteAsyncOption.po}
        defaultValue={poId}
      />
      {renderSpinner}
    </Box>
  );
};

export default FBReceivePOAutocompletePresenter;
