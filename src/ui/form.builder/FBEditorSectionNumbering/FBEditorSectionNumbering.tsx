import { InputAdornment } from "@material-ui/core";
import React from "react";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import FBTextField from "../components/inputs/FBTextField";
import FBStore from "../stores/ui/FBStore";
import { FBInputProps } from "../types/common";

const FBEditorSectionNumbering: React.FunctionComponent<Pick<FBInputProps, "index">> = ({
  index = 0,
}) => (
  <FBTextField
    label="form.builder.label"
    name="label"
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          {`#${FBStore.sectionNumber(index)}`}
        </InputAdornment>
      ),
    }}
  />
);

export default FBEditorSectionNumbering;
