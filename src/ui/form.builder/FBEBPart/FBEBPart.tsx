import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBData, FBDialog, FBEBPartProps, FBInput, FBProvider, FBRadioGroup } from "..";
import { withFBEBPart } from "./FBEBPart.wrap";

const FBEBPart: React.FunctionComponent<FBEBPartProps> = ({
  handleAdd,
  ebPartState,
  dialogState,
  defaultValue,
  loading,
  disabled,
  forceNewRender,
  name,
  optionId,
  childrenParts,
  childrenPartsForRevise,
  ...props
}) => (
  <FBProvider {...{ dialogState, ebPartState }}>
    <FBDialog />
    <FBRadioGroup
      label="form.builder.part.revision"
      name="partType"
      gutter={false}
      withState
      options={FBData.partTypeOptions}
    />
    <FBInput type="ebpart">
      <Box display="flex" alignItems="flex-end" mt={2.5}>
        <Box flexGrow={1}>
          <FBAutocompleteAsync
            label="form.builder.part"
            placeholder="form.builder.select.existing.part"
            gutter={false}
            shouldReloadOnInit
            withState
            name="childrenParts"
            optionId={FBAutocompleteAsyncOption.availableParts}
            additionalData={childrenParts}
            {...{
              disabled,
              loading,
              defaultValue,
              forceNewRender,
            }}
          />
          <FBAutocompleteAsync
            label="form.builder.part"
            placeholder="form.builder.select.existing.part"
            gutter={false}
            shouldReloadOnInit
            withState
            name="childForRevise"
            optionId={FBAutocompleteAsyncOption.availablePartDocuments}
            additionalData={childrenPartsForRevise}
            {...{
              disabled,
              loading,
              defaultValue,
              forceNewRender,
            }}
          />
        </Box>
        <Box>
          <FBButton
            variant="contained"
            label="form.builder.create.new.part"
            onClick={handleAdd}
            disabled={disabled}
          />
        </Box>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBEBPart(FBEBPart);
