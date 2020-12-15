import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBData, FBDialog, FBEBPartProps, FBInput, FBProvider, FBRadioGroup, PartType } from "..";
import { withFBEBPart } from "./FBEBPart.wrap";

const FBEBPart: React.FunctionComponent<FBEBPartProps> = ({
  handleAdd,
  ebPartState,
  dialogState,
  defaultValue,
  loading,
  disabled,
  forceNewRender,
  childrenParts,
  childrenPartsForRevise,
  partTypeDefaultValue,
  childForReviseValue,
  childrenPartsValue,
}) => (
  <FBProvider {...{ dialogState, ebPartState }}>
    <FBDialog />
    <FBRadioGroup
      label="Part Type"
      name="partType"
      gutter={false}
      options={FBData.partTypeOptions}
      defaultValue={partTypeDefaultValue}
      withState
      omitFormValue
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
            omitFormValue
            hidden={partTypeDefaultValue === PartType.Document}
            name="childrenParts"
            optionId={FBAutocompleteAsyncOption.availableParts}
            additionalData={childrenParts}
            defaultValue={childrenPartsValue}
            {...{
              disabled,
              loading,
              forceNewRender,
            }}
          />
          <FBAutocompleteAsync
            label="form.builder.scheduled.part"
            placeholder="form.builder.select.existing.part"
            gutter={false}
            shouldReloadOnInit
            withState
            omitFormValue
            hidden={partTypeDefaultValue === PartType.DocumentRevision}
            name="childForRevise"
            optionId={FBAutocompleteAsyncOption.availablePartDocuments}
            additionalData={childrenPartsForRevise}
            defaultValue={childForReviseValue}
            {...{
              disabled,
              loading,
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
