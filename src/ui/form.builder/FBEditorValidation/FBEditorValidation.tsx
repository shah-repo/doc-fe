import { Box, Icon } from "@material-ui/core";
import React from "react";
import { FBButton, FBDialog, FBEditorValidationProps, FBProvider, FBRadioGroup, FBSchema } from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBFontStyles } from "../styles/FBFont.styles";
import { withFBEditorValidation } from "./FBEditorValidation.wrap";

const FBEditorValidation: React.FunctionComponent<FBEditorValidationProps> = ({
  handleCustomValidation,
  schema = [],
  schemaState,
  dialogState,
  customValidationEnabled,
}) => {
  const classes  = FBFontStyles();
  return (
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
          labelProps={{ fontFamily: "Sora", fontWeight: 600, fontSize: 14, color: Colors.almost_black, lineHeight: "18px" }}
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
            className={classes.font}
          />
        </Box>
      )}
      <Box px={2}>
        <FBSchema {...{ schema, schemaState }} />
      </Box>
    </FBProvider>

  );
};

export default withFBEditorValidation(FBEditorValidation);
