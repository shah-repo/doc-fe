import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBDialog, FBForm, FBInput, FBPOReceiveProps, FBProvider } from "..";
import { withFBPOReceive } from "./FBPOReceive.wrap";

const FBPOReceive: React.FunctionComponent<FBPOReceiveProps> = ({
  onChange,
  poReceiveState,
  dialogState,
  initialValues,
  defaultValue,
  loading,
  schema,
  gutter,
  name,
  disabled,
  ...props
}) => (
  <FBProvider {...{ poReceiveState, dialogState }} >
    <FBDialog />
    <FBInput {...{ name }} {...props} type="poreceive">
      <FBAutocompleteAsync
        {...{ onChange, defaultValue, gutter, disabled }}
        name={`porec-${name}`}
        optionId={FBAutocompleteAsyncOption.POList}
        omitFormValue
        shouldReloadOnInit
        withState
      />
      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {!loading && schema && <FBForm {...{ schema, initialValues }} />}
    </FBInput>
  </FBProvider>
);

export default withFBPOReceive(FBPOReceive);
