import React from "react";
import FBOptionsContainer from "../custom/FBOptionsContainer";
import FBCheckboxGroup from "../inputs/FBCheckboxGroup";
import FBLabelEditor from "./FBLabelEditor";
import FBStepperEditor from "./FBStepperEditor";
import { FBOptionProps } from "../../types/common";
import { FBGroupEditorOptions } from "../../defaults/editor";
import _ from "lodash";

const FBSelectEditor: React.FunctionComponent<Pick<FBOptionProps, "options">> = ({
  options = _.get(FBGroupEditorOptions, "select"),
}) => (
  <FBStepperEditor>
    <FBLabelEditor />
    <FBOptionsContainer label="form.builder.options" name="options" />
    <FBCheckboxGroup
      label="Option additions"
      options={options}
    />
  </FBStepperEditor>
);

export default FBSelectEditor;
