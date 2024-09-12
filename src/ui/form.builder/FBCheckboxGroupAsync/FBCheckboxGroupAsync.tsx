import { FormGroup } from '@material-ui/core';
import React from 'react';
import { FBCheckboxGroupProps, FBInput } from '..';
import { styles } from '../styles/FBEditorCheckbox.styles';
import { FBFontStyle } from '../styles/FBFont.styles';
import { withFBCheckboxGroupAsync } from './FBCheckboxGroupAsync.wrap';

const FBCheckboxGroupComp: React.FunctionComponent<FBCheckboxGroupProps> = ({
  row, controls, name,
}) => {
  const classes = styles();
  return (
    <FormGroup {...{ row, name }} className={classes.checkbox}>
      {controls}
    </FormGroup>
  );
};

const FBCheckboxGroupChild = withFBCheckboxGroupAsync(FBCheckboxGroupComp);

const FBCheckboxGroupAsync: React.FunctionComponent<FBCheckboxGroupProps> = ({
  controls,
  row = true,
  ...props
}) => (
  <FBInput {...props} type="checkboxgroup" labelProps={FBFontStyle.labelProps}>
    <FBCheckboxGroupChild {...props} {...{ row, controls }} />
  </FBInput>
);

export default FBCheckboxGroupAsync;
