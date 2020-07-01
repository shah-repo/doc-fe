import { Box, Icon } from "@material-ui/core";
import React from "react";
import { FBButton, FBDialog, FBEditorValidationProps, FBProvider, FBRadioGroup, FBSchema } from "..";
import { withFBEditorValidation } from "./FBEditorValidation.wrap";

const FBEditorValidation: React.FunctionComponent<FBEditorValidationProps> = ({
  handleCustomValidation,
  schema = [],
  schemaState,
  dialogState,
  customValidationEnabled,
}) => (
  <FBProvider {...{ dialogState }} >
    <Box bgcolor="#f6f7f7" px={2} pt={1}>
      <FBDialog />
      <FBRadioGroup
        name="validationMode"
        label="Validation Mode"
        defaultValue="default"
        options={[
          {
            text: "Default",
            value: "default",
          },
          {
            text: "Show/Hide",
            value: "visibility",
          },
          {
            text: "Enable/disable",
            value: "disabled",
          },
        ]}
      />
    </Box>
    {customValidationEnabled && (
      <Box display="flex" justifyContent="flex-end">
        <FBButton
          variant="outlined"
          color="primary"
          endIcon={<Icon>send</Icon>}
          label="Custom Validation"
          onClick={handleCustomValidation}
        />
      </Box>
    )}
    <Box px={2}>
      <FBSchema {...{ schema, schemaState }} />
    </Box>
  </FBProvider>

);

export default withFBEditorValidation(FBEditorValidation);
