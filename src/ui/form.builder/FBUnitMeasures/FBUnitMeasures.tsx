import React from 'react';
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBUnitMeasuresProps } from '..';

const FBUnitMeasures: React.FunctionComponent<FBUnitMeasuresProps> = ({
  name,
  disabled,
  label,
  gutter,
  defaultValue,
}) => (
  <FBAutocompleteAsync
    type="unitMeasures"
    optionId={FBAutocompleteAsyncOption.unitMeasures}
    autosave
    withState
    defaultValue={defaultValue}
    {...{ disabled, name, label, gutter }}
  />
);

export default FBUnitMeasures;
