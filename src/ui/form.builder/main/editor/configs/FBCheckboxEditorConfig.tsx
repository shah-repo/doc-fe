import { Box } from "@material-ui/core";
import React from "react";
import FBButton from "../../../components/inputs/button/FBButton";
import FBCheckbox from "../../../components/inputs/checkbox/FBCheckbox";
import FBTextField from "../../../components/inputs/textfield/FBTextField";
import { templateStore } from "../../../stores/templateStore";

const FBCheckboxEditorConfig: React.FunctionComponent<{}> = () => {

  const namePrefix = templateStore.namePrefix();

  return (
    <Box>
      <FBTextField label="Label" name={`${namePrefix}_label_field`} />
      <FBTextField label="Notes" name={`${namePrefix}_notes_field`} />
      <FBCheckbox controlLabel="Required" name={`${namePrefix}_required_field`} />
      <FBButton type="submit" label="Add" />
    </Box>
  );
};

export default FBCheckboxEditorConfig;
