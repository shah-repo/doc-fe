import React from "react";
import { FBAutocompleteAsync } from "..";
import { FBLabelEditorProps } from "../components/editors/FBLabelEditor";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
import FBTextField from "../components/inputs/FBTextField";

const FBEditorInstructionsDocument: React.FunctionComponent<FBLabelEditorProps> = ({
  defaultValue,
}) => (
  <>
    <FBTextField label="form.builder.label" name="label" {...{ defaultValue }}  />
    <FBAutocompleteAsync
      label="form.builder.document"
      name="instructionsDocument"
      optionId="1"
    />
    <FBCheckboxGroup
      name="editor-additions"
      label="form.builder.additions"
      options={[
        { value: "reviseDisabled", text: "form.builder.revise.disabled" },
      ]}
    />
  </>
);

export default FBEditorInstructionsDocument;
