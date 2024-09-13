import { FormGroup } from '@material-ui/core';
import React from 'react';
import { FBCheckboxGroupProps, FBInput } from '..';
import { styles } from '../styles/FBEditorCheckbox.styles';
import { FBFontStyle } from '../styles/FBFont.styles';
import { withFBCheckboxGroupAsync } from './FBCheckboxGroupAsync.wrap';

const FBCheckboxGroupAsync: React.FunctionComponent<FBCheckboxGroupProps> = ({
  controls,
  row = true,
  ...props
}) => {
  const classes = styles();

  const FBCheckboxGroupChild = withFBCheckboxGroupAsync(({ row, controls, ...restProps }) => (
    <FormGroup {...{ row }} className={classes.checkbox}>
      {controls}
    </FormGroup>
  ));

  return (
    <FBInput {...props} type="checkboxgroup" labelProps={FBFontStyle.labelProps}>
      <FBCheckboxGroupChild {...props} {...{ row, controls }} />
    </FBInput>
  );
};

export default FBCheckboxGroupAsync;
