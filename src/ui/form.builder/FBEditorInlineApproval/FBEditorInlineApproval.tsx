import React from "react";
import { FBEditorInlineApprovalProps } from "..";
import FBTextField from "../components/inputs/FBTextField";
import FBDRStore from "../stores/ui/FBDRStore";

const FBEditorInlineApproval: React.FunctionComponent<FBEditorInlineApprovalProps> = ({
  defaultValue,
  ...props
}) => (
  <>
    {/* {FBDRStore.isOutput && <FBEditorApprovalField {...props} includeLabel={false} />} */}
    {!FBDRStore.isOutput && (
      <FBTextField label="form.builder.label" name="label" {...{ defaultValue }}  />
    )}
  </>
);

export default FBEditorInlineApproval;
