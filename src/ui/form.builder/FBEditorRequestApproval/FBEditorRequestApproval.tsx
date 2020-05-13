import React from "react";
import { FB, FBEditorApprovalField, FBEditorApprovalFieldProps, FBEditorLabel } from "..";

const FBEditorRequestApproval: React.FunctionComponent<FBEditorApprovalFieldProps> = ({
  ...props
}) => {
  const { workspaceState } = FB.useStores();
  const { isOutput } = workspaceState || {};
  return (
    <>
      {isOutput && <FBEditorApprovalField {...props} includeLabel={false} />}
      {!isOutput && <FBEditorLabel {...props}  />}
    </>
  ); };

export default FBEditorRequestApproval;
