import { FormGroup } from '@material-ui/core';
import React, { useState } from 'react';
import { FBInput } from '..';
import { OptionType } from '../../administration/general.settings/panels/SupplierSettings/SupplierConfiguration/types';
import { styles as useStyles } from '../styles/FBEditorCheckbox.styles';
import { FBFontStyle } from '../styles/FBFont.styles';
import { FBCheckboxGroupAsyncProps } from './FBCheckboxGroupAsync.types';
import { withFBCheckboxGroupAsync } from './FBCheckboxGroupAsync.wrap';
import OtherOptionField from './OtherOptionField';

const FBCheckboxGroupAsync: React.FunctionComponent<FBCheckboxGroupAsyncProps> = ({
  controls,
  row = true,
  ...props
}) => {
  const classes = useStyles();
  const [selectedCheckBoxOptions, setSelectedCheckBoxOptions] = useState<OptionType[]>([]);

  const FBCheckboxGroupChild = withFBCheckboxGroupAsync(({ row, controls, ...restProps }) => (
    <FormGroup {...{ row }} className={classes.checkbox}>
      {controls}
    </FormGroup>
  ));

  return (
    <>
      <FBInput {...props} type="checkboxgroup" labelProps={FBFontStyle.labelProps}>
        <FBCheckboxGroupChild
          {...props}
          {...{ row, controls }}
          setSelectedCheckBoxOptions={setSelectedCheckBoxOptions}
        />
      </FBInput>
      <OtherOptionField {...props} selectedCheckBoxOptions={selectedCheckBoxOptions} />
    </>
  );
};

export default FBCheckboxGroupAsync;
