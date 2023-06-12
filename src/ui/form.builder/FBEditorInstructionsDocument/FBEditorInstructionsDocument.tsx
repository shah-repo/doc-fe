import React from 'react';
import { FBAutocompleteAsync, FBEditor, FBEditorLabel, FBEditorProps } from '..';
import Colors from '../../layout/theme/utils/colors';
import { styles } from '../styles/FBAutocomplete.styles';

const FBEditorInstructionsDocument: React.FunctionComponent<FBEditorProps> = ({
  children,
  includeDefaultValue,
  standalone = false,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBEditorLabel {...props} {...{ inputProps, includeDefaultValue }} standalone={true} />
    <FBAutocompleteAsync
      label="form.builder.document"
      name="instructionsDocument"
      optionId="1"
      rules="required"
      inputPropStyle={ { height: 47, borderWidth: 1, borderColor: Colors.gray_goose, borderRadius: 3 } }
      labelProps={styles.labelProps}
      inputPropStyleSize="small"
    />
    {children}
  </FBEditor>
);

export default FBEditorInstructionsDocument;
