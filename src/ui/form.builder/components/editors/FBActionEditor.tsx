
import React from "react";
import actionCollection from "../../stores/domain/collections/FBActionCollection";
import FBCheckboxGroup from "../inputs/FBCheckboxGroup";

const FBActionEditor: React.FunctionComponent<{}> = () => (
  <FBCheckboxGroup
    name="actions"
    label="Actions"
    row={true}
    optionLabelKey="description"
    optionValueKey="name"
    options={actionCollection.data()}
  />
);

export default FBActionEditor;
