import { InputAdornment } from "@material-ui/core";
import React from "react";
import { FBEditorStepSectionProps } from ".";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import FBTextField from "../components/inputs/FBTextField";
import FBStore from "../stores/ui/FBStore";

const FBEditorStepSection: React.FunctionComponent<FBEditorStepSectionProps> = ({
  index = 0,
  defaultValue,
}) => (
  <FBTextField
    label="form.builder.label"
    name="label"
    {...{ defaultValue }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          {`#${FBStore.sectionNumber(index)}`}
        </InputAdornment>
      ),
    }}
  />
);

export default FBEditorStepSection;
