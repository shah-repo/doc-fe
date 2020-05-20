import React from "react";
import { FBEditorApprovalField, FBEditorInlineApprovalProps } from "..";
import FBCheckboxGroup from "../components/inputs/FBCheckboxGroup";
import FBTextField from "../components/inputs/FBTextField";
import FBDRStore from "../stores/ui/FBDRStore";

const FBEditorInlineApproval: React.FunctionComponent<FBEditorInlineApprovalProps> = ({
  defaultValue,
  ...props
}) => (
  <>
    {FBDRStore.isOutput && <FBEditorApprovalField {...props} includeLabel={false} />}
    {!FBDRStore.isOutput && (
      <>
        <FBTextField label="form.builder.label" name="label" {...{ defaultValue }}  />
        <FBCheckboxGroup
          name="editor-additions"
          label="form.builder.additions"
          options={[
            { value: "reviseDisabled", text: "form.builder.revise.disabled" },
          ]}
        />
      </>
    )}
  </>
);

export default FBEditorInlineApproval;
