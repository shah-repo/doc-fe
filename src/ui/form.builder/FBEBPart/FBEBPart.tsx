import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBEBPartProps, FBInput, FBProvider } from "..";
import { withFBEBPart } from "./FBEBPart.wrap";

const FBEBPart: React.FunctionComponent<FBEBPartProps> = ({
  onAddClick,
  loading,
  disabled,
  ...props
}) => (
  <FBProvider>
    <FBInput type="ebpart">
      <Box display="flex">
        <Box flexGrow={1}>
          <FBAutocompleteAsync
            label="form.builder.part"
            placeholder="form.builder.select.existing.part"
            optionId={FBAutocompleteAsyncOption.availableParts}
            name="childrenParts"
            gutter={false}
            withState
            disabled={disabled || loading}
            {...{ loading }}
          />
        </Box>
        <Box mt={4}>
          <FBButton
            variant="contained"
            label="form.builder.create.new.part"
            onClick={onAddClick}
            disabled={disabled || loading}
          />
        </Box>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBEBPart(FBEBPart);
