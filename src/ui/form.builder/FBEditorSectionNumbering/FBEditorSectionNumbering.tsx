import { InputAdornment } from "@material-ui/core";
import React from "react";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import FBTextField from "../components/inputs/FBTextField";
import FBStore from "../stores/ui/FBStore";

const FBEditorSectionNumbering: React.FunctionComponent<{}> = () => (
  <FBTextField
    label="form.builder.label"
    name="label"
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          {`#${FBStore.sectionNumbering}`}
        </InputAdornment>
      ),
    }}
  />
);

export default FBEditorSectionNumbering;
