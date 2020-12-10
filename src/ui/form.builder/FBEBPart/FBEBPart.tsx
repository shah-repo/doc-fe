import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBButton, FBData, FBDialog, FBEBPartProps, FBInput, FBProvider, FBRadioGroup } from "..";
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
  partType = "documentRevision",
  optionId,
  ...props
}) => (
  <FBProvider {...{ dialogState, ebPartState }}>
    <FBDialog />
    <FBRadioGroup
      omitFormValue
      defaultValue="documentRevision"
      label="Part Type"
      name="partType"
      gutter={false}
      withState
      options={FBData.partTypeOptions}
    />
    <FBInput type="ebpart">
      <Box display="flex" alignItems="flex-end">
        <Box flexGrow={1}>
          <FBAutocompleteAsync
            label="form.builder.part"
            placeholder="form.builder.select.existing.part"
            gutter={false}
            shouldReloadOnInit
            withState
            {...{
              optionId,
              disabled,
              loading,
              name,
              defaultValue,
              additionalData,
              forceNewRender,
            }}
          />
        </Box>
        <Box>
          <FBButton
            variant="contained"
            label="form.builder.create.new.part"
            onClick={handleAdd}
            disabled={disabled || partType === "document"}
          />
        </Box>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBEBPart(FBEBPart);
