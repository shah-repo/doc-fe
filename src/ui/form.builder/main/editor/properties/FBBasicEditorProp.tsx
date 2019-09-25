import { Box } from "@material-ui/core";
import React from "react";
import FBCheckbox from "../../../components/inputs/checkbox/FBCheckbox";
import FBTextField from "../../../components/inputs/textfield/FBTextField";
import { templateStore } from "../../../stores/templateStore";

const FBBasicEditorProp: React.FunctionComponent<{}> = () => {

  const namePrefix = templateStore.namePrefix();

  return (
    <Box>
      <FBTextField label="Label" name={`${namePrefix}_label_field`} />
      <FBTextField label="Placeholder" name={`${namePrefix}_placeholder_field`} />
      <FBCheckbox label="Required" name={`${namePrefix}_required_field`} />
    </Box>
  );
};

export default FBBasicEditorProp;
