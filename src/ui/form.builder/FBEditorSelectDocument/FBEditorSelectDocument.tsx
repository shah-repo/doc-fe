import React from "react";
import { FBAutocompleteAsync, FBEditor, FBEditorLabel, FBEditorProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { styles as AutoCompleteStyles } from "../styles/FBAutocomplete.styles";

const FBEditorSelectDocument: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  standalone = false,
  inputProps,
  inputProps: { options } = {},
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBEditorLabel {...props} {...{ inputProps, includeDefaultValue }} standalone={true} />
    <FBAutocompleteAsync
      label="form.builder.options"
      name="options"
      optionId="1"
      multiple={true}
      defaultValue={options}
      rules="required"
      inputPropStyle={ { height: 47, borderWidth: 1, borderColor: Colors.gray_goose, borderRadius: "3px" } }
      labelProps={AutoCompleteStyles.labelProps}
      inputPropStyleSize="small"
    />
    {children}
  </FBEditor>
);

export default FBEditorSelectDocument;
