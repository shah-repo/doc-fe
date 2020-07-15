import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBDialog, FBForm, FBPOReceiveProps } from "..";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from "../FBAutocompleteAsync";
import { FBProvider } from "../FBProvider";
import { withFBPOReceive } from "./FBPOReceive.wrap";

const FBPOReceive: React.FunctionComponent<FBPOReceiveProps> = ({
  poReceiveState,
  dialogState,
  initialValues,
  loading,
  schema,
  name,
  ...props
}) => (
  <FBProvider {...{ poReceiveState, dialogState }} >
    <FBDialog />
    <Box mb={4}>
      <FBAutocompleteAsync
        {...props}
        {...{ name }}
        optionId={FBAutocompleteAsyncOption.POList}
      />
      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {!loading && schema && <FBForm {...{ schema, initialValues }} />}
    </Box>
  </FBProvider>
);

export default withFBPOReceive(FBPOReceive);
