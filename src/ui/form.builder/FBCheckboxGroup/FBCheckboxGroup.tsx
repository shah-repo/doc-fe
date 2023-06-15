import { FormGroup } from '@material-ui/core';
import React from 'react';
import { FBCheckboxGroupProps, FBInput } from '..';
import { styles } from '../styles/FBEditorCheckbox.styles';
import { FBFontStyle } from '../styles/FBFont.styles';
import { withFBCheckboxGroup } from './FBCheckboxGroup.wrap';

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

const FBCheckboxGroupChild = withFBCheckboxGroup(FBCheckboxGroupComp);

const FBCheckboxGroup: React.FunctionComponent<FBCheckboxGroupProps> = ({
  controls,
  row = true,
  ...props
}) => (
  <FBInput {...props}  type="checkboxgroup" labelProps={FBFontStyle.labelProps}>
    <FBCheckboxGroupChild {...props} {...{ row, controls }} />
  </FBInput>
);

export default FBCheckboxGroup;
