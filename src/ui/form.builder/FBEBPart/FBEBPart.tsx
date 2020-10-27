import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBEBPartProps, FBInput, FBProvider } from "..";
import { withFBEBPart } from "./FBEBPart.wrap";

const FBEBPart: React.FunctionComponent<FBEBPartProps> = ({
  formState,
  onAddClick,
}) => (
  <FBProvider {...{ formState }}>
    <FBInput type="ebpart">
      <Box display="flex">
        <Box flexGrow={1}>
          <FBAutocompleteAsync
            label="form.builder.part"
            placeholder="form.builder.select.existing.part"
            optionId={FBAutocompleteAsyncOption.availableParts}
            name="childrenParts"
          />
        </Box>
        <Box mt={4}>
          <FBButton
            variant="contained"
            label="form.builder.create.new.part"
            onClick={onAddClick}
          />
        </Box>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBEBPart(FBEBPart);
