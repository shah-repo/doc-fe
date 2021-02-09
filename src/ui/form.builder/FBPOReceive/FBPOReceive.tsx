import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBDialog, FBForm, FBInput, FBPOReceiveProps } from "..";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from "../FBAutocompleteAsync";
import { FBProvider } from "../FBProvider";
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
  ...props
}) => (
  <FBProvider {...{ poReceiveState, dialogState }} >
    <FBDialog />
    <FBInput {...{ name }} {...props} type="poreceive">
      <FBAutocompleteAsync
        {...{ onChange, defaultValue, gutter }}
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
