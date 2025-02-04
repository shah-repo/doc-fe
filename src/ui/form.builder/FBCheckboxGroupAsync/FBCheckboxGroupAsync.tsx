import { FormGroup } from '@material-ui/core';
import React from 'react';
import { FBInput } from '..';
import { styles as useStyles } from '../styles/FBEditorCheckbox.styles';
import { FBFontStyle } from '../styles/FBFont.styles';
import { FBCheckboxGroupAsyncProps } from './FBCheckboxGroupAsync.types';
import { withFBCheckboxGroupAsync } from './FBCheckboxGroupAsync.wrap';

const FBCheckboxGroupAsync: React.FunctionComponent<
FBCheckboxGroupAsyncProps
> = ({ controls, row = true, ...props }) => {
  const classes = useStyles();

  const FBCheckboxGroupChild = withFBCheckboxGroupAsync(
    ({ row, controls, ...restProps }) => (
      <FormGroup {...{ row }} className={classes.checkbox}>
        {controls}
      </FormGroup>
    ),
  );

  return (
    <FBInput
      {...props}
      type="checkboxgroup"
      labelProps={FBFontStyle.labelProps}
    >
      <FBCheckboxGroupChild {...props} {...{ row, controls }} />
    </FBInput>
  );
};

export default FBCheckboxGroupAsync;
