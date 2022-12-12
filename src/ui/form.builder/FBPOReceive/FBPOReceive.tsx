import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBDialog, FBForm, FBInput, FBPOReceiveProps, FBProvider } from "..";
import { FBFontStyle } from "../styles/FBFont.styles";
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
    <Box mb={3.5}>
      <FBInput {...{ name, gutter }} {...props} type="poreceive" labelProps={FBFontStyle.labelProps}>
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
      </FBInput>
    </Box>
    {!loading && schema && <FBForm {...{ schema, initialValues }} />}
  </FBProvider>
);

export default withFBPOReceive(FBPOReceive);
