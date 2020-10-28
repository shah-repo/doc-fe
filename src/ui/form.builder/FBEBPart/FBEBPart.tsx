import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBEBPartProps, FBInput, FBProvider, FBText } from "..";
import { withFBEBPart } from "./FBEBPart.wrap";

const FBEBPart: React.FunctionComponent<FBEBPartProps> = ({
  onAddClick,
  loading,
  disabled,
  ...props
}) => (
  <FBProvider>
    <FBText
      locale="form.builder.part"
      boxProps={{ fontWeight: "fontWeightBold", mb: 2, fontSize: "medium" }}
    />
    <FBInput type="ebpart">
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>
          <FBAutocompleteAsync
            placeholder="form.builder.select.existing.part"
            optionId={FBAutocompleteAsyncOption.availableParts}
            name="childrenParts"
            gutter={false}
            withState
            disabled={disabled || loading}
            {...{ loading }}
          />
        </Box>
        <Box>
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
