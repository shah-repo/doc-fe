import { Box } from "@material-ui/core";
import React from "react";
import { FBDialog, FBEditorValidationProps, FBProvider, FBRadioGroup, FBSchema } from "..";
import { ReactComponent as ARIcon } from "../../../assets/images/cr_blue.svg";
import Colors from "../../layout/theme/utils/colors";
import { StyledCancelFBButton } from "../FBButton/StyledCancelFBButton";
import { FBFontStyle } from "../styles/FBFont.styles";
import { withFBEditorValidation } from "./FBEditorValidation.wrap";

const FBEditorValidation: React.FunctionComponent<FBEditorValidationProps> = ({
  handleCustomValidation,
  schema = [],
  schemaState,
  dialogState,
  customValidationEnabled,
}) => (
  <FBProvider {...{ dialogState }} >
    {customValidationEnabled && (
      <Box display="flex" justifyContent="flex-end" pb={3}>
        <StyledCancelFBButton
          variant="outlined"
          color="primary"
          startIcon={<ARIcon />}
          label="Custom Rules"
          style={{ width: "270px" }}
          onClick={handleCustomValidation}
        />
      </Box>
    )}
    <Box bgcolor={Colors.white} px={2} pt={1}>
      <FBDialog />
      <FBRadioGroup
        name="validationMode"
        label="Rule Mode"
        defaultValue="default"
        row={false}
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
        labelProps={FBFontStyle.labelProps}
      />
    </Box>
    <Box px={2}>
      <FBSchema {...{ schema, schemaState }} />
    </Box>
  </FBProvider>

);

export default withFBEditorValidation(FBEditorValidation);
