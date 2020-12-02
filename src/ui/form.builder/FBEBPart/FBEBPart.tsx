import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBEBPartProps, FBInput, FBProvider } from "..";
import { withFBEBPart } from "./FBEBPart.wrap";

const FBEBPart: React.FunctionComponent<FBEBPartProps> = ({
  handleAdd,
  ebPartState,
  dialogState,
  defaultValue,
  additionalData,
  loading,
  disabled,
  forceNewRender,
  name,
  // formState,
  ...props
}) => (
  <FBProvider {...{ dialogState, ebPartState }}>
    <FBDialog />
    <FBInput type="ebpart">
      <Box display="flex" alignItems="flex-end">
        <Box flexGrow={1}>
          <FBAutocompleteAsync
            label="form.builder.part"
            placeholder="form.builder.select.existing.part"
            optionId={FBAutocompleteAsyncOption.availableParts}
            gutter={false}
            shouldReloadOnInit
            withState
            {...{ disabled, loading, name, defaultValue, additionalData, forceNewRender }}
          />
        </Box>
        <Box>
          <FBButton
            variant="contained"
            label="form.builder.create.new.part"
            onClick={handleAdd}
            {...{ disabled }}
          />
        </Box>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBEBPart(FBEBPart);
