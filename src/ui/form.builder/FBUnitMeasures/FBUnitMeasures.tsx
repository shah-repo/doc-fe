import React from 'react';
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBUnitMeasuresProps } from '..';
import { withFBInput } from '../FBInput/FBInput.wrap';

const FBUnitMeasures: React.FunctionComponent<FBUnitMeasuresProps> = ({
  name,
  disabled,
  label,
  gutter,
  hidden,
  defaultValue,
}) => (
  <>
    {!hidden
      && <FBAutocompleteAsync
        type="unitMeasures"
        optionId={FBAutocompleteAsyncOption.unitMeasures}
        autosave
        withState
        defaultValue={defaultValue}
        {...{ disabled, name, label, gutter }}
      />
    }
  </>

);

export default withFBInput(FBUnitMeasures);
