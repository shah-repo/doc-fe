import { Box } from "@material-ui/core";
import React from "react";
import FBButton from "../../../components/inputs/button/FBButton";
import FBCheckbox from "../../../components/inputs/checkbox/FBCheckbox";
import FBCheckboxGroup from "../../../components/inputs/checkbox/FBCheckboxGroup";
import FBTextField from "../../../components/inputs/textfield/FBTextField";
import { templateStore } from "../../../stores/templateStore";
import { withBasicConfig } from "../hocs/withBasicConfig";
import FBBasicEditorProp from "./FBBasicEditorProp";

const FBTextFieldEditorProp: React.FunctionComponent<{}> = () => {

  const namePrefix = templateStore.namePrefix();
  const requiredOptions = [
    {
      name: `${namePrefix}_required_field_yes`,
      controlLabel: "Yes",
    },
    {
      name: `${namePrefix}_required_field_no`,
      controlLabel: "No",
    },
  ];

  return (
    <Box>
      <FBTextField label="Label" name={`${namePrefix}_label_field`} />
      <FBTextField label="Placeholder" name={`${namePrefix}_placeholder_field`} />
      <FBTextField
        type="number"
        label="Row number"
        name={`${namePrefix}_rows_field`}
      />
      <FBCheckboxGroup
        label="Required"
        options={requiredOptions}
      />
      <FBButton type="submit" label="Add" />
    </Box>
  );
};

export default withBasicConfig(FBTextFieldEditorProp);
