import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBUnitMeasuresProps } from "..";

const FBUnitMeasures: React.FunctionComponent<FBUnitMeasuresProps> = ({
  name,
  disabled,
  label,
}) => (
  <FBAutocompleteAsync
    type="unitMeasures"
    optionId={FBAutocompleteAsyncOption.unitMeasures}
    withState
    {...{ disabled, name, label }}
  />
);

export default FBUnitMeasures;
