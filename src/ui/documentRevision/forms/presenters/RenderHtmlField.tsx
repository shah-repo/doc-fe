import * as React from "react";
import InputField from "../../../components/forms/fields/Input";
import { styles as FBAutoCompleteStyles } from "../../../form.builder/styles/FBAutocomplete.styles";
import { styles } from "./styles/DocIdInput.styles";

interface Props {
  isDisabled: boolean;
}

const RenderHtmlField: React.FunctionComponent<Props> = ({ isDisabled = false }) => {
  const classes = styles();
  return (
    <InputField
      name="renderHTML"
      label="common.renderHTML"
      inputProps={{ id: "RenderHTML", rows: 5, multiline: true, disabled: isDisabled }}
      inputStyleProps={classes.input}
      labelProps={FBAutoCompleteStyles.labelStyle}
    />
  );
};

export default RenderHtmlField;
