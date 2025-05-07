import { FormGroup } from '@material-ui/core';
import React, { useState } from 'react';
import { FBInput } from '..';
import { OptionType } from '../../administration/general.settings/panels/SupplierSettings/SupplierConfiguration/types';
import { styles as useStyles } from '../styles/FBEditorCheckbox.styles';
import { FBFontStyle } from '../styles/FBFont.styles';
import OtherOptionField from './OtherOptionField';
import { FBSupplierCheckboxGroupAsyncProps } from './types';
import { withFBSupplierCheckboxGroupAsync } from './wrap';

const FBSupplierCheckboxGroupAsync: React.FunctionComponent<FBSupplierCheckboxGroupAsyncProps> = ({
  controls,
  row = true,
  ...props
}) => {
  const classes = useStyles();
  const [selectedCheckBoxOptions, setSelectedCheckBoxOptions] = useState<OptionType[]>([]);

  const FBSupplierCheckboxGroupChild = withFBSupplierCheckboxGroupAsync(({ row, controls, ...restProps }) => (
    <FormGroup {...{ row }} className={classes.checkbox}>
      {controls}
    </FormGroup>
  ));

  return (
    <>
      <FBInput {...props} type="checkboxgroup" labelProps={FBFontStyle.labelProps}>
        <FBSupplierCheckboxGroupChild
          {...props}
          {...{ row, controls }}
          setSelectedCheckBoxOptions={setSelectedCheckBoxOptions}
        />
      </FBInput>
      <OtherOptionField {...props} selectedCheckBoxOptions={selectedCheckBoxOptions} />
    </>
  );
};

export default FBSupplierCheckboxGroupAsync;
