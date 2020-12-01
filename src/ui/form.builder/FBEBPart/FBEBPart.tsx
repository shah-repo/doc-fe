import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsyncOption, FBButton, FBDialog, FBEBPartProps, FBInput, FBProvider, FBRadioGroup } from "..";
import FBEBPartAutocomplete from "../FBEBPartAutocomplete/FBEBPartAutocomplete";
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
  ...props
}) => (
  <FBProvider {...{ dialogState, ebPartState }}>
    <FBDialog />
    <FBRadioGroup
      defaultValue="documentRevision"
      label="Part Type"
      name="partType"
      gutter={false}
      withState
      options={[{
        text: "Specific document revision",
        value: "documentRevision",
      },
      {
        text: "Document",
        value: "document",
      }]}
    />
    <FBInput type="ebpart">
      <Box display="flex" alignItems="flex-end">
        <Box flexGrow={1}>
          {partType === "document" && (
            <FBEBPartAutocomplete
              autocompleteOption={FBAutocompleteAsyncOption.availablePartDocuments}
              {...{ disabled, loading, name, defaultValue, additionalData, forceNewRender }}
            />
          )}
          {partType === "documentRevision" && (
            <FBEBPartAutocomplete
              autocompleteOption={FBAutocompleteAsyncOption.availableParts}
              {...{ disabled, loading, name, defaultValue, additionalData, forceNewRender }}
            />
          )}
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
