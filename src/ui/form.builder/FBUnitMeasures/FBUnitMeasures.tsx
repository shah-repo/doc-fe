import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from "..";
import { FBUnitMeasuresProps } from "./FBUnitMeasures.types";

const FBUnitMeasures: React.FunctionComponent<FBUnitMeasuresProps> = ({
  name,
  disabled,
  label,
}) => (
  <FBAutocompleteAsync
    type="unitMeasures"
    optionId={FBAutocompleteAsyncOption.unitMeasures}
    autosave
    withState
    {...{ disabled, name, label }}
  />
);

export default FBUnitMeasures;
