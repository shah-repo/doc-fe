import { Box } from "@material-ui/core";
import React from "react";
import { FBEditorValidationProps, FBRadioGroup, FBSchema } from "..";
import { withFBEditorValidation } from "./FBEditorValidation.wrap";

const FBEditorValidation: React.FunctionComponent<FBEditorValidationProps> = ({
  schema = [],
  schemaState,
}) => (
  <>
    <Box bgcolor="#f6f7f7" px={2} pt={1}>
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
    <Box px={2}>
      <FBSchema {...{ schema, schemaState }} />
    </Box>

  </>

);

export default withFBEditorValidation(FBEditorValidation);
